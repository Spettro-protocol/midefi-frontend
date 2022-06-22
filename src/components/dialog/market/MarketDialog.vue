<template>
  <v-dialog v-model="flag" width="800">
    <v-card v-click-outside="onClickOutside" class="market-dialog dialog container">
      <div class="container">
        <v-row class="ma-0 d-flex align-center">
          <v-col cols="1" class="d-flex justify-center">
            <v-img
              class="ml-5"
              :src="require(`@/assets/tokens/${data.token.logo}.png`)"
              :alt="`token ${data.token.logo} icon`"
            />
          </v-col>
          <v-col cols="2">
            <v-row class="ml-5 item d-flex justify-start">
              <h1 class="ma-0">{{ data.token.symbol }}</h1>
            </v-row>
            <v-row v-if="!ismiFTM" class="ml-5 d-flex justify-start">
              <a class="listTitle" target="_blank" :href="rskExplorerUrl">
                {{ data.token.symbol }} Addr
              </a>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row>
              <h2>price:</h2>
            </v-row>
            <v-row class="item d-flex justify-start">
              <span>{{ price | formatPrice }}</span
              ><span class="ml-2 itemInfo">usd</span>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div class="container">
        <v-row class="ma-2 d-flex align-center">
          <v-col cols="3">
            <h3>Contract Liquidity</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ updatedTotalCash | formatNumber }} </span>
          </v-col>
          <v-col cols="0">
            <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <h3>cToken Exchange Rate</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ exchangeRate | formatNumber }} </span>
          </v-col>
        </v-row>
        <v-row class="ma-2 d-flex align-center">
          <v-col cols="3">
            <h3>Total borrow</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ updatedTotalBorrow | formatNumber }}</span>
          </v-col>
          <v-col cols="0">
            <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <h3>Est. Compound Borrow interest (year)</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ borrowAPY | formatPercentage }} </span>
          </v-col>
        </v-row>

        <v-row class="ma-2 d-flex align-center">
          <v-col cols="3">
            <h3>Total Supplied</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ updatedTotalSupply | formatNumber }}</span>
          </v-col>
          <v-col cols="0">
            <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <h3>Est. Compound Supply interest (year)</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ supplyAPY | formatPercentage }} </span>
          </v-col>
        </v-row>
        <v-row class="ma-2 d-flex align-center">
          <v-col cols="3">
            <h3>Total Reserves</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ updatedTotalReserve | formatNumber }} </span>
          </v-col>
          <v-col cols="0">
            <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <h3>Reserve Factor</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ reserveFactor | formatPercentage }} </span>
          </v-col>
        </v-row>

        <v-row class="ma-2 d-flex align-center">
          <v-col cols="3">
            <h3>Supply-Borrowed ratio</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ supBorRatio | formatPercentage }} </span>
          </v-col>
          <v-col cols="2" />
          <v-col cols="3" class="d-flex align-center">
            <h3>Collateral Factor (LTV)</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ collFact | formatPercentage }} </span>
          </v-col>
        </v-row>

        <v-row class="ma-2 d-flex align-center">
          <v-col cols="3">
            <h3>Close Factor</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ closeFactor | formatToken(data.token.decimals) | formatPercentage }} </span>
          </v-col>
          <v-col cols="2" />
          <v-col cols="3" class="d-flex align-center">
            <h3>Liquidation Incentive</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ liqPen | formatPercentage }} </span>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <template v-if="priceFlag">
      <MarketPriceDialog :data="dataObject" @closed="reset" />
    </template>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import MarketPriceDialog from '@/components/dialog/market/MarketPriceDialog.vue'
import BigNumber from 'bignumber.js'

export default {
  name: 'MarketDialog',
  components: {
    MarketPriceDialog,
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
      price: 0,
      updatedTotalSupply: 0, // sum of supply in this market
      updatedTotalBorrow: 0, // sum of borrowed in this market
      updatedTotalCash: 0, // sum of underyling tokens currently held in this market
      updatedTotalReserve: 0, // sum of reserves in this market
      supplyAPY: 0, // the supply apr
      borrowAPY: 0, // the borrow apr
      supBorRatio: 0, // the sup/borr ratio
      collFact: 0, // the collateral factor
      reserveFactor: 0, // reserveFactorMantissa
      exchangeRate: 0, // exchangeRate
      liqPen: 0, // the liquidation penalty
      mktLiqu: 0, // market liquidity in usd
      priceFlag: false,
      ismiFTM: false,
      closeFactor: 0,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    rskExplorerUrl() {
      return !process.env.VUE_APP_HTTP_EXPLORER
        ? '#'
        : `${process.env.VUE_APP_HTTP_EXPLORER}address/${this.data.market.token.address}`
    },
    dataObject() {
      return {
        flag: this.priceFlag,
        market: this.data.market,
        token: this.data.token,
      }
    },
  },
  async created() {
    this.reserveFactor = this.data.market.reserveFactorMantissa.times(100)
    this.collFact = this.data.market.loanToValue.times(100)
    this.exchangeRate = this.data.market.exchangeRateCurrent
    this.supplyAPY = this.data.market.supplyApy
    this.borrowAPY = this.data.market.borrowApy
    this.updatedTotalBorrow = this.data.market.totalBorrows
    this.updatedTotalCash = this.data.market.totalCash
    this.updatedTotalReserve = this.data.market.totalReserves
    this.updatedTotalSupply = await this.data.market.getTotalSupplyInUnderlying(false)
    this.borrowRate = await this.data.market.getBorrowRate(false)
    this.price = await this.data.market.getPriceInDecimals()
    this.mktLiqu = this.updatedTotalCash.times(this.price)
    this.supBorRatio =
      this.updatedTotalSupply != 0
        ? new BigNumber(this.updatedTotalBorrow.toString())
            .div(this.updatedTotalSupply.toString())
            .times(100)
            .toNumber()
        : 0
    this.liqPen = await this.data.market.getLiquidationIncentiveMantissa()
    this.ismiFTM = this.data.market.ismiFTM
    const closeFactor = await this.$middleware.getLiquidationFactor()
    this.closeFactor = closeFactor.mul(100)

    this.reset()
  },
  methods: {
    onClickOutside() {
      if (!this.priceFlag) {
        this.flag = false
        this.$emit('closed')
      }
    },
    reset() {
      this.priceFlag = false
    },
  },
}
</script>
