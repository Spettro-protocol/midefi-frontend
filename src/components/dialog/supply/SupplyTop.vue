<template>
  <v-row class="supply-top ma-0 d-flex align-center">
    <v-col cols="2" class="d-flex justify-center">
      <v-img
        class="ml-5"
        :src="require(`@/assets/tokens/${data.token.logo}.png`)"
        width="60"
        :alt="`token ${data.token.logo} icon`"
      />
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
        <h2>supplied to contract:</h2>
      </v-row>
      <v-row
        class="item d-flex justify-start"
        :title="[`Balance ${tokenBalance} ${data.token.symbol}`]"
      >
        <!-- {{ tokenBalance | formatToken(data.token.decimals) -->
        {{ tokenBalancePrice | formatPrice }}<span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'

export default {
  name: 'SupplyTop',
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
      tokenAddress: '',
      ismiFTM: false,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    balanceAsDouble() {
      return (this.tokenBalance / 10 ** this.data.token.decimals).toFixed(this.data.token.decimals)
    },
    rskExplorerUrl() {
      return `${process.env.VUE_APP_HTTP_EXPLORER}address/${this.tokenAddress}`
    },
  },
  created() {
    // set token address
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
      })
  },
}
</script>
