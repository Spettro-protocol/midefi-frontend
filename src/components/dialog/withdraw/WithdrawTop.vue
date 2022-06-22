<template>
  <v-row class="withdraw-top ma-0 d-flex align-center">
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
        <h2>apr:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        {{ calculateSupplyRate | formatPercentage }}
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'WithdrawTop',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      price: 0,
      supplyRate: 0,
      tokenDecimals: 0,
      tokenAddress: '',
      ismiFTM: false,
    }
  },
  computed: {
    rskExplorerUrl() {
      return `${process.env.VUE_APP_HTTP_EXPLORER}address/${this.tokenAddress}`
    },
    ...mapState({
      calculateApr: (state) => state.Controller.calculateApr,
    }),
    calculateSupplyRate() {
      if (!this.calculateApr) return this.supplyRate
      return this.calculateApr
    },
  },
  created() {
    this.ismiFTM = this.data.market.ismiFTM
    this.tokenAddress = this.ismiFTM ? '' : this.data.market.token.address
    this.tokenDecimals = this.data.market.token.decimals
    this.data.market.getSupplyRate().then((supplyRate) => {
      this.supplyRate = supplyRate
    })
    this.data.market.getPriceInDecimals().then((price) => {
      this.price = price
    })
  },
}
</script>
