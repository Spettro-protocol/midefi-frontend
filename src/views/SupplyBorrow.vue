<template>
  <div class="supply-borrow">
    <v-row class="my-5 d-flex justify-center supply-borrow-banner">
      <JSCharting :options="_chartOptions" class="columnChart"></JSCharting>
      <!-- <div class="healthBorder d-flex justify-center">
        <div class="mx-3">
          Health Factor:
          <span class="ml-2 healthFactor" :style="{ color: healthFactorColor }">
            {{ healthFactor }}%
          </span>
        </div>
      </div> -->
      <v-tooltip right color="#E5E5E5">
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mx-5" v-bind="attrs" v-on="on">info</v-icon>
        </template>
        <div class="tooltip">
          Your Health Factor represents <br />
          the state of your loans.
          <span class="boldie">
            Don't <br />
            let it drop to <span class="redish"> 0% </span></span
          >
          or your <br />
          collateral might be liquidated!
        </div>
      </v-tooltip>
    </v-row>
    <v-row class="d-flex justify-center supply-borrow-tables">
      <v-col>
        <SupplyList @listChange="reset" @launchTx="catchTx" @setCalulateApr="setApr" />
      </v-col>
      <v-col>
        <BorrowList @listChange="reset" @launchTx="catchTx" @setCalulateApr="setApr" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SupplyList from '@/components/supply/SupplyList.vue'
import BorrowList from '@/components/borrow/BorrowList.vue'
import { mapState, mapMutations } from 'vuex'
import * as constants from '@/store/constants'
import JSCharting from 'jscharting-vue'

export default {
  name: 'SupplyBorrow',
  components: {
    SupplyList,
    BorrowList,
    JSCharting,
  },
  data() {
    return {
      accountHealth: 1,
      currentComponent: null,
      hasEnteredToSomeMarket: true,
      transactionHash: null,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    _chartOptions() {
      return {
        type: 'gauge ',
        legend_visible: false,
        yAxis: {
          defaultTick_padding: 10,
          line: {
            onTop: false,
            color: '#114b8b',
            width: 10,

            /*If defined, breaks will be used at tick positions.*/
            breaks_gap: 0.05,
          },
          scale_range: [0, 100],
        },
        defaultSeries: {
          // mouseTracking_enabled: false,
          angle: { end: 180, start: -90 },
          defaultPoint_tooltip: '<b>%seriesName</b> %yValue%',
          shape: {
            defaultLabel: { align: 'left', style_color: '#707070' },
            innerSize: '60%',
            label: [
              {
                verticalAlign: 'middle',
                align: 'center',
                text: '<icon name=linearicons/heart-pulse size=125 padding=20 fill=#7eb7f1 >',
              },
            ],
          },
        },
        series: [
          {
            name: 'Health Factor',
            type: 'column roundCaps',
            points: [['value', this.accountHealth >= 1 ? 100 : this.accountHealth * 100]],
          },
        ],
      }
    },
    healthFactor() {
      return this.accountHealth >= 1 ? 100 : (this.accountHealth * 100).toFixed(2)
    },
    healthFactorColor() {
      if (this.accountHealth <= 0.3) return '#EB5757'
      if (this.accountHealth > 0.3 && this.accountHealth <= 0.6) return '#F2994A'
      return '#24BD6B'
    },
    getHttpTokenBridge() {
      return process.env.VUE_APP_HTTP_TOKEN_BRIDGE
    },
  },
  mounted() {
    this.$on('reload', this.reset)
  },
  async created() {
    this.currentComponent = this.$route.params.tab === 'borrow' ? 'BorrowList' : 'SupplyList'
    this.accountHealth = await this.$middleware.getAccountHealth(this.account)
    this.hasEnteredToSomeMarket = await this.$middleware.hasEnteredToSomeMarket(this.account)
  },
  methods: {
    async reset() {
      this.accountHealth = await this.$middleware.getAccountHealth(this.account)
      this.hasEnteredToSomeMarket = await this.$middleware.hasEnteredToSomeMarket(this.account)
      //clear calculate apr
      this.setApr(0)
    },
    catchTx(obj) {
      const { promiseAction, symbol, nameAction, amount, isApprove } = obj
      this.transactionHash = null
      //validate obj has an action
      if (typeof promiseAction.then !== 'function') return
      //send snack
      this.setSnack('WAITING FOR CONFIRMATION')
      //await action tx (sender to wallet)
      promiseAction
        .then((transaction) => {
          this.transactionHash = transaction.hash
          //when approve tx send wait snack
          this.setWaitTxSnack()
          //await for wait tx
          return transaction.wait()
        })
        // TODO: validate transactionResult
        // eslint-disable-next-line no-unused-vars
        .then((transactionResult) => {
          this.persistEventLocalStorage(nameAction, amount, this.transactionHash, Date.now(), true)

          if (isApprove === true)
            this.setSuccessApproveTxSnack({
              tx: this.transactionHash,
              token: symbol,
            })
          else
            this.setSuccessTxSnack({
              tx: this.transactionHash,
              token: symbol,
              amount: this.$options.filters.formatNumber(amount),
              action: nameAction,
            })
          this.reset()
        })
        .catch((error) => {
          const userError = typeof error === 'string' ? error : error.message || ''
          this.setFailTxSnack({ error: userError })
          this.persistEventLocalStorage(nameAction, amount, this.transactionHash, Date.now(), false)
        })
    },
    ...mapMutations({
      setSnack: constants.SNACK_SET,
      setSuccessTxSnack: constants.SNACK_SET_SUCCESS_TX,
      setSuccessApproveTxSnack: constants.SNACK_SET_SUCCESS_APPROVE_TX,
      setWaitTxSnack: constants.SNACK_SET_WAIT_TX,
      setFailTxSnack: constants.SNACK_SET_FAIL_TX,
      setCalulatedApr: constants.CALCULATE_APR,
    }),
    persistEventLocalStorage(event, amount, hash, date, status) {
      const txLS = this.$user.createTx(hash, event, amount, date, status)
      this.$user.addTxToAccountList(txLS, this.account)
    },
    setApr(calulateApr) {
      this.setCalulatedApr(calulateApr)
    },
  },
}
</script>
<style>
.columnChart {
  margin-top: 20px;
  height: 300px;
  width: 300px;
  background-color: #e2ecf9;
}

.columnChart > div > svg > g > g > path {
  fill: #e2ecf9;
}
</style>
