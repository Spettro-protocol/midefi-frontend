<template>
  <v-dialog v-model="flag" width="700" :persistent="waiting || succeed">
    <v-card v-click-outside="onClickOutside" class="supply-dialog dialog container">
      <template v-if="!succeed && !errorDialog">
        <component :is="topComponent" :data="marketTokenObject" />
        <template v-if="!waiting">
          <v-row class="d-flex justify-center">
            <div class="toggle my-5">
              <!-- <div class="toggle-triple my-5"> -->
              <!-- <v-btn
                :class="[currentComponent === 'LiquidateInput' ? 'selected' : 'notSelected']"
                text
                @click="currentComponent = 'LiquidateInput'"
              >
                <span>Liquidate</span>
              </v-btn> -->
              <v-btn
                :class="[currentComponent === 'SupplyInput' ? 'selected' : 'notSelected']"
                text
                @click="currentComponent = 'SupplyInput'"
              >
                <span>Supply</span>
              </v-btn>
              <v-btn
                :class="[currentComponent === 'WithdrawInput' ? 'selected' : 'notSelected']"
                text
                @click="currentComponent = 'WithdrawInput'"
              >
                <span>Withdraw</span>
              </v-btn>
            </div>
          </v-row>
        </template>
        <template>
          <component
            :is="currentComponent"
            :data="marketTokenObject"
            @succeed="actionSucceed"
            @wait="waiting = true"
            @error="actionError"
            @approve="backToDialog"
            @closeDialog="close"
            v-on="$listeners"
          />
        </template>
      </template>
      <template v-if="errorDialog && !succeed">
        <ErrorDialog :data="errorObject" @closeDialog="close" />
      </template>
      <template v-if="succeed">
        <SuccessTop :data="marketTokenObject" />
        <component :is="successComponent" :data="successObject" @closeDialog="close" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import SupplyTop from '@/components/dialog/supply/SupplyTop.vue'
import SuccessTop from '@/components/dialog/SuccessTop.vue'
import SupplySuccess from '@/components/dialog/supply/SupplySuccess.vue'
import SupplyInput from '@/components/dialog/supply/SupplyInput.vue'
import WithdrawInput from '@/components/dialog/withdraw/WithdrawInput.vue'
import WithdrawTop from '@/components/dialog/withdraw/WithdrawTop.vue'
import WithdrawSuccess from '@/components/dialog/withdraw/WithdrawSuccess.vue'
import LiquidateInput from '@/components/dialog/liquidate/LiquidateInput.vue'
import LiquidateSuccess from '@/components/dialog/liquidate/LiquidateSuccess.vue'
import ErrorDialog from '@/components/dialog/ErrorDialog.vue'
import { mapState } from 'vuex'

export default {
  name: 'SupplyDialog',
  components: {
    SupplyTop,
    SuccessTop,
    SupplySuccess,
    SupplyInput,
    WithdrawInput,
    WithdrawTop,
    WithdrawSuccess,
    LiquidateInput,
    LiquidateSuccess,
    ErrorDialog,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: this.data.flag,
      currentComponent: 'SupplyInput',
      successComponent: 'SupplySuccess',
      topComponent: 'SupplyTop',
      succeed: false,
      waiting: false,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      liquidateValue: null,
      costValue: null,
      collateral: null,
      hash: null,
      errorDialog: null,
      userErrorMessage: null,
      accountStorage: '',
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    marketTokenObject() {
      return {
        token: this.data.token,
        market: this.data.market,
      }
    },
    successObject() {
      return {
        market: this.data.market,
        token: this.data.token,
        borrowLimitInfo: this.borrowLimitInfo,
        supplyBalanceInfo: this.supplyBalanceInfo,
        liquidateValue: this.liquidateValue,
        costValue: this.costValue,
        collateral: this.collateral,
        hash: this.hash,
      }
    },
    errorObject() {
      return {
        market: this.data.market,
        token: this.data.token,
        userErrorMessage: this.userErrorMessage,
      }
    },
  },
  watch: {
    currentComponent() {
      if (this.currentComponent === 'SupplyInput') {
        this.successComponent = 'SupplySuccess'
        this.topComponent = 'SupplyTop'
      } else if (this.currentComponent === 'WithdrawInput') {
        this.successComponent = 'WithdrawSuccess'
        this.topComponent = 'WithdrawTop'
      } else {
        this.successComponent = 'LiquidateSuccess'
        this.topComponent = 'SupplyTop'
      }
      this.$emit('setCalulateApr', 0)
    },
  },
  mounted() {
    if (localStorage.rLendingA0x449BED8c30d909eCaCda721FECE4A9cfC940aD08) {
      this.accountTxStorage = localStorage.rLendingA0x449BED8c30d909eCaCda721FECE4A9cfC940aD08
    }
  },
  methods: {
    reset() {
      this.flag = false
      this.succeed = false
      this.waiting = false
      this.supplyBalanceInfo = null
      this.borrowLimitInfo = null
      this.currentComponent = 'SupplyInput'
      this.hash = null
      this.errorDialog = null
      this.userErrorMessage = null
    },
    actionError(errorObject) {
      this.succeed = false
      this.waiting = false
      this.errorDialog = true
      this.userErrorMessage = errorObject.userErrorMessage || ''
      this.supplyBalanceInfo = errorObject.supplyBalanceInfo ?? errorObject.amount
    },
    actionSucceed(succeedObject) {
      this.hash = succeedObject.hash
      this.borrowLimitInfo = succeedObject.borrowLimitInfo
      this.supplyBalanceInfo = succeedObject.supplyBalanceInfo ?? succeedObject.amount
      this.succeed = true
      this.waiting = false
      this.errorDialog = false
      this.liquidateValue = succeedObject.liquidateValue
      this.collateral = succeedObject.collateral
      this.costValue = succeedObject.costValue
    },
    backToDialog() {
      this.succeed = false
      this.waiting = false
      this.errorDialog = false
    },
    onClickOutside() {
      this.reset()
      this.$emit('closed')
    },
    close() {
      this.reset()
      this.$emit('closed')
    },
  },
}
</script>
