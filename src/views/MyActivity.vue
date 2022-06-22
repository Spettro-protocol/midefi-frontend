<template>
  <div class="my-activity">
    <div v-if="dataLoaded" class="upper-banner">
      <v-dialog v-model="showHealthWarning" width="450">
        <v-card class="container">
          <v-row class="ma-0 py-2 d-flex justify-center">
            <v-icon color="#000000" large>report_problem</v-icon>
          </v-row>
          <v-row class="ma-0 py-2 d-flex justify-center">
            <h1 class="blackish">Watch out!</h1>
          </v-row>
          <v-row class="ma-0 pt-6 d-flex justify-center">
            <p class="text-center">
              Your Health Factor has dropped to <span class="redish"> 0%</span>!
            </p>
          </v-row>
          <v-row class="ma-0 px-3 d-flex justify-center">
            <p class="text-center">
              All your collaterals will be liquidated. If you wish to continue trading on MIDeFi,
              feel free to supply new markets on the network.
            </p>
          </v-row>
        </v-card>
      </v-dialog>
      <!-- account balance -->
      <v-row class="ma-0 py-2">
        <v-col class="pa-0">
          <!-- supply borrow graph -->
          <div class="container" width="100%" style="maxwidth: none">
            <SupplyBorrowGraph :healthfactor="accountHealth" />
          </div>
        </v-col>
      </v-row>
      <v-row class="ma-0 py-2">
        <!-- history tx  -->
        <v-col class="pa-0">
          <div class="container" width="100%" style="maxwidth: none">
            <TransactionList />
          </div>
        </v-col>
      </v-row>
      <v-row class="ma-0"> </v-row>
    </div>
    <template v-else>
      <v-card flat class="loader d-flex align-center justify-center">
        <div class="container">
          <v-row class="my-5 d-flex justify-center">
            <v-progress-circular indeterminate :size="80" color="#3e954a" />
          </v-row>
        </div>
      </v-card>
    </template>
  </div>
</template>

<script>
import SupplyBorrowGraph from '@/components/dashboard/SupplyBorrowGraph.vue'
import TransactionList from '@/components/dashboard/TransactionList.vue'
import { mapState } from 'vuex'
import { cTokensDetails } from '../middleware/constants'
import Vue from 'vue'
import VueNumber from 'vue-number-animation'

Vue.use(VueNumber)

export default {
  name: 'MyActivity',
  components: {
    SupplyBorrowGraph,
    TransactionList,
  },
  data() {
    return {
      healthFactor: 0,
      totalBalance: [],
      totalSupplied: [],
      totalBorrowed: [],
      showHealthWarning: null,
      polling: null,
      markets: [],
      accountStorage: '',
      dataLoaded: false,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    accountHealth() {
      return this.healthFactor.toFixed(2)
    },
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  async created() {
    for (const market of cTokensDetails) {
      this.$middleware.getAdapterPrice(market.adapter).then((price) => {
        this.markets.push({
          symbol: market.underlying.symbol,
          logo: market.logo,
          adapter: market.adapter,
          price: price.toNumber(),
          oldPrice: price.toNumber(),
          priceUp: 0,
        })
      })
    }
    await this.fetchData()
    this.dataLoaded = true
    this.pollData()
  },
  methods: {
    pollData() {
      this.polling = setInterval(async () => {
        await this.fetchData()
      }, 20000)
    },
    async fetchData() {
      const { borrowValue, supplyValue } = await this.$middleware.getTotalSupplysAndBorrows(
        this.account,
      )
      //refact this totals for int var and set in last hook
      this.totalBorrowed[0] = borrowValue.toNumber()
      this.totalSupplied[0] = supplyValue.toNumber()
      this.totalBalance[0] = supplyValue.minus(borrowValue).toNumber()
      const health = await this.$middleware.getAccountHealth(this.account)
      this.healthFactor = health > 1 ? 100 : health * 100
      this.showHealthWarning = Number(this.healthFactor) === 0
      this.getMarketsPrices()
    },
    async getMarketsPrices() {
      if (this.markets.length < 1) return
      for (const indice in this.markets) {
        this.$middleware.getAdapterPrice(this.markets[indice].adapter).then((price) => {
          this.markets[indice].price = price.toNumber()
          this.markets[indice].priceUp = this.markets[indice].price - this.markets[indice].oldPrice
          this.markets[indice].oldPrice = this.markets[indice].price
        })
      }
    },
    tweenedFormat(number) {
      return number.toFixed(3)
    },
  },
}
</script>
