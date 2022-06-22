<template>
  <div class="liquidate-success">
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully Liquidated <br />
          this Market with
          <span class="greenish">
            {{ data.liquidateValue }}
          </span>
          <span class="greenish">{{ data.token.symbol }}</span>
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex justify-end">
          <h3>supplied to contract:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7" class="d-flex justify-center">
              <h1>{{ data.collateral.amount | formatNumber }}</h1>
            </v-col>
            <v-col cols="5" class="itemInfo"> </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.collateral.symbol }}</span>
        </v-col>
        <v-col cols="2" />
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex align-end justify-end">
          <h3>Cost:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7" class="d-flex justify-center">
              <h1>
                {{ data.liquidateValue | formatNumber }}
              </h1>
            </v-col>
            <v-col cols="5" class="itemInfo"> </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2" />
      </v-row>
    </div>
    <TransactionHash :hash="data.hash" />
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#3e954a" @click="closeDialog">
        Back to Supply / Borrow
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TransactionHash from '@/components/common/TransactionHash.vue'

export default {
  name: 'LiquidateSuccess',
  components: {
    TransactionHash,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tokenBalance: 0,
      liquidity: 0,
      cash: 0,
      price: 0,
      maxBorrowAllowed: 0,
      supplyOf: 0,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  created() {
    this.data.market
      .getUserBalanceOfUnderlying()
      .then((tokenBalance) => {
        this.tokenBalance = tokenBalance
        this.supplyOf = tokenBalance
        return this.$middleware.getAccountLiquidity(this.account)
      })
      .then((accountLiquidity) => {
        this.liquidity = accountLiquidity
        return this.data.market.getCash()
      })
      .then((cash) => {
        this.cash = cash
        return this.data.market.getPrice()
      })
      .then((price) => {
        this.price = price
        return this.data.market.maxBorrowAllowedByAccount(this.account)
      })
      .then((maxBorrow) => {
        this.maxBorrowAllowed = maxBorrow
      })
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    getMaxAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0
      return allowed >= cash ? cash : allowed
    },
  },
}
</script>
