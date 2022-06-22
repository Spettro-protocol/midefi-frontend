<template>
  <div>
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="value.toString()"
      tabindex="0"
      :title="titleMessage"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span class="toggle-background" :class="backgroundStyles" />
      <span class="toggle-indicator" :style="indicatorStyles" />
    </span>
    <Confirm ref="confirm"></Confirm>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Confirm from '@/components/common/Confirm.vue'
import * as Sentry from '@sentry/browser'
import * as constants from '@/store/constants'

export default {
  name: 'ToggleMarketButton',
  components: {
    Confirm,
  },
  props: {
    market: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      value: false,
      titleMessage: '',
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    backgroundStyles() {
      if (this.disabled) return 'grey-disabled'
      return {
        'blue-mid': this.value,
        'gray-lighter': !this.value,
      }
    },
    indicatorStyles() {
      return { transform: this.value ? 'translateX(14px)' : 'translateX(0)' }
    },
  },
  async created() {
    this.value = await this.market.checkMembership(this.account)
    this.titleMessage = this.value
      ? 'This asset will no longer be used towards your borrowing limit, and can’t be seized in liquidation.'
      : 'Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation'
  },
  methods: {
    async toggle() {
      const title = this.value ? 'Exit the market' : 'Enter the market'

      const description = this.value
        ? 'Are you sure you want to exit the market?'
        : 'Are you sure you want to enter the market?'

      const result = await this.$refs.confirm.open(title, description)
      if (result) {
        try {
          this.setSnack('WAITING FOR CONFIRMATION')
          let tx
          if (this.value) {
            // Exit the market
            const { events } = await this.market.exitMarket().then(async (exitMarket) => {
              tx = exitMarket.hash
              this.setWaitTxSnack()
              return await exitMarket.wait()
            })
            if (events.length > 0 && events[0]?.event === 'Failure') {
              throw new Error(
                'There was a problem trying to exit the market, please try again later',
              )
            }
          } else {
            // Enter the market
            const { events } = await this.market.enterMarket().then(async (enterMarket) => {
              tx = enterMarket.hash
              this.setWaitTxSnack()
              return await enterMarket.wait()
            })
            if (events.length > 0 && events[0]?.event === 'Failure') {
              throw new Error(
                'There was a problem trying to enter the market, please try again later',
              )
            }
          }
          this.value = !this.value
          const message = this.value
            ? 'You have successfully entered the market!'
            : 'You successfully exit the market!'

          this.setGeneralSnack({
            snack: 'Success !',
            subMessage: message,
            color: 'success',
            tx: tx,
          })
        } catch (err) {
          Sentry.captureException(err)
          const userError = typeof err === 'string' ? err : err.message || ''
          this.setFailTxSnack({ error: userError })
        }
      }
    },
    ...mapMutations({
      setSnack: constants.SNACK_SET,
      setWaitTxSnack: constants.SNACK_SET_WAIT_TX,
      setFailTxSnack: constants.SNACK_SET_FAIL_TX,
      setGeneralSnack: constants.SNACK_GENERAL_SET,
    }),
  },
}
</script>
