<template>
  <v-row class="borrow-top ma-0 d-flex align-center">
    <v-col cols="2" class="d-flex justify-center">
      <v-img class="ml-5" :src="require(`@/assets/tokens/${data.token.logo}.png`)" width="60" />
    </v-col>
    <v-col cols="2">
      <v-row class="item">
        <h1 class="ma-0">{{ data.token.symbol }}</h1>
      </v-row>
      <v-row class="d-flex justify-center">
        <a v-if="!ismiFTM" class="ml-2 listTitle" target="_blank" :href="rskExplorerUrl">
          {{ data.token.symbol }} Addr
        </a>
      </v-row>
    </v-col>
    <v-col cols="3">
      <v-row>
        <h2>price:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        <span>{{ price | formatPrice }}</span
        ><span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="3">
      <v-row>
        <h2>liquidity provided:</h2>
      </v-row>
      <v-row
        class="item d-flex justify-start"
        :title="[`Balance ${tokenBalance} ${data.token.symbol}`]"
      >
        {{ tokenBalancePrice | formatPrice }}<span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="2">
      <v-row>
        <h2>apr:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        {{ calculateBorrowRate | formatPercentage }}
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'

export default {
  name: 'BorrowTop',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      price: 0,
      tokenBalance: 0,
      tokenBalancePrice: 0,
      borrowRate: 0,
      liqProvided: 0,
      tokenAddress: '',
      ismiFTM: false,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      calculateApr: (state) => state.Controller.calculateApr,
    }),
    calculateBorrowRate() {
      if (!this.calculateApr) return this.borrowRate
      return this.calculateApr
    },
    rskExplorerUrl() {
      return `${process.env.VUE_APP_HTTP_EXPLORER}address/${this.tokenAddress}`
    },
  },
  created() {
    this.ismiFTM = this.data.market.ismiFTM
    this.tokenAddress = this.ismiFTM ? '' : this.data.market.token.address
    // set token balance
    this.data.market
      .getUserBalanceOfUnderlying()
      .then((balance) => {
        this.tokenBalance = balance
        return this.data.market.getPriceInDecimals()
      })
      // set price
      .then((price) => {
        this.price = price
        this.tokenBalancePrice = new BigNumber(this.tokenBalance).multipliedBy(
          new BigNumber(this.price),
        )
        return this.data.market.getBorrowRate()
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate
      })
  },
}
</script>
