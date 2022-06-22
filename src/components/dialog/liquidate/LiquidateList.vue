<template>
  <div>
    <div v-if="hasAccounts && status === 'finished'" class="liquidate-list">
      <h1>Select the collaterals you wish to liquidate:</h1>
      <v-row class="d-flex justify-center"> </v-row>
      <div class="container">
        <v-row>
          <v-col class="d-flex justify-center">
            <h2>Address</h2>
          </v-col>
          <v-col class="d-flex justify-center">
            <h2>Collateral to be Liquidated</h2>
          </v-col>
        </v-row>
        <v-row class="ma-0 px-6">
          <v-divider />
        </v-row>
        <v-list v-for="(borrow, idx) in borrows" :key="`liquidate-item-${idx}`" class="mx-6">
          <LiquidateItem
            :borrower="borrow.borrower"
            :max-to-liquidate="borrow.maxToLiquidate"
            :debt="borrow.debt"
            :borrow-market-address="borrow.borrowMarketAddress"
            :collateral="borrow.market"
            @selected="accountSelected"
          />
          <v-divider />
        </v-list>
      </div>
    </div>
    <div v-else-if="status === 'finished' && !hasAccounts" class="py-6 empty-liquidate">
      <v-row class="my-6 d-flex justify-center">
        <v-icon class="d-flex justify-center" x-large color="#000000"> error_outline </v-icon>
      </v-row>
      <v-row class="ma-6 d-flex justify-center">
        <h1>There are no accounts available to be liquidated</h1>
      </v-row>
      <v-row class="my-6 d-flex justify-center"> Please check later. </v-row>
    </div>
    <div v-else class="py-6 empty-liquidate">
      <v-row class="my-6 d-flex justify-center"> Wait until load... </v-row>
      <v-row class="my-6 d-flex justify-center">
        <v-progress-circular indeterminate :size="30" color="#3e954a" />
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LiquidateItem from '@/components/dialog/liquidate/LiquidateItem.vue'

export default {
  name: 'LiquidateListVue',
  components: {
    LiquidateItem,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      borrows: [],
      status: null,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    hasAccounts() {
      return this.borrows.length > 0
    },
  },
  created() {
    this.getBorrows()
  },
  methods: {
    accountSelected(accountObject) {
      this.$emit('selected', accountObject)
    },
    async getUnhealthyAccounts(market) {
      //get all account under water
      const accounts = await market.getAccountUnderwater()
      for (const account of accounts) {
        const borrowBalance = await market.borrowBalanceCurrent(account)
        const supply = await market.balanceOfUnderlying(account)
        if (borrowBalance.isZero()) {
          continue
        }
        let underwater = {
          //set instance cToken
          borrowMarketAddress: market.instanceAddress,
          //set account to liquidate
          borrower: account,
          //set max to liquidate => borrow of account
          maxToLiquidate: borrowBalance,
          //set asset of the account
          debt: supply,
          market: market,
        }
        this.borrows.push(underwater)
      }
    },
    async getBorrows() {
      this.status = 'loading'
      const markets = await this.$middleware.getMarkets(this.account)
      const marketsFiltered = markets.filter(
        (market) => market.instanceAddress === this.data.market.instanceAddress,
      )
      const marketsFilteredPromises = marketsFiltered.map((market) =>
        this.getUnhealthyAccounts(market),
      )
      await Promise.all(marketsFilteredPromises)
      this.status = 'finished'
    },
  },
}
</script>
