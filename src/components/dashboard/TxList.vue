<template>
  <v-col v-if="hasTransactions" cols="8" class="mx-6 tx-list container">
    <v-row class="mx-6">
      <v-col cols="8">
        <v-row>
          <h1>Transaction History</h1>
        </v-row>
        <v-row>
          <span>Last updated: {{ lastUpdated }}</span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col>
            <v-row>
              <img src="../../assets/myActivity/supplied.svg" alt="" />
              <h3 class="mx-2">Supplied</h3>
            </v-row>
            <v-row>
              <img src="../../assets/myActivity/borrowed.svg" alt="" />
              <h3 class="mx-2">Borrowed</h3>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <img src="../../assets/myActivity/withdrawn.svg" alt="" />
              <h3 class="mx-2">Withdrawn</h3>
            </v-row>
            <v-row>
              <img src="../../assets/myActivity/repay.svg" alt="" />
              <h3 class="mx-2">Repayed</h3>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-6">
      <v-col>
        <h2>Market</h2>
      </v-col>
      <v-col>
        <h2>Price</h2>
      </v-col>
      <v-col>
        <h2>APR</h2>
      </v-col>
      <v-col>
        <h2>Transaction</h2>
      </v-col>
    </v-row>
    <v-row class="mx-6">
      <div class="tx-divider"></div>
    </v-row>
    <v-list v-for="(tx, idx) in transactions" :key="`tx-item-${idx}`" class="mx-6">
      <TxItem
        :transaction-hash="tx.transactionHash"
        :market-name="tx.market"
        :amount="tx.transactionAmount"
        :apr="tx.apr"
        :price="tx.price"
        :operation="tx.operation"
        :decimals="tx.decimals"
      />
      <div class="tx-divider"></div>
    </v-list>
  </v-col>
</template>

<script>
import TxItem from '@/components/dashboard/TxItem.vue'
import { mapState } from 'vuex'

export default {
  name: 'TxList',
  components: {
    TxItem,
  },
  data() {
    return {
      lastUpdated: '',
      transactions: [],
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    hasTransactions() {
      return this.transactions.length !== 0
    },
  },
  created() {
    this.getTransactions()
  },
  methods: {
    pushMarketEvents(market, marketDeployBlock, symbol, price, borrowRate, decimals) {
      market.getPastEvents('Supply', marketDeployBlock, { user: this.account }).then((events) => {
        events.forEach(({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push({
            market: symbol,
            price,
            apr: borrowRate,
            transactionHash,
            transactionAmount: Number(amount),
            operation: event,
            decimals,
          })
        })
      })
      market.getPastEvents('Borrow', marketDeployBlock, { user: this.account }).then((events) => {
        events.forEach(({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push({
            market: symbol,
            price,
            apr: borrowRate,
            transactionHash,
            transactionAmount: Number(amount),
            operation: event,
            decimals,
          })
        })
      })
      market.getPastEvents('Redeem', marketDeployBlock, { user: this.account }).then((events) => {
        events.forEach(({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push({
            market: symbol,
            price,
            apr: borrowRate,
            transactionHash,
            transactionAmount: Number(amount),
            operation: event,
            decimals,
          })
        })
      })
      market
        .getPastEvents('PayBorrow', marketDeployBlock, { user: this.account })
        .then((events) => {
          events.forEach(({ event, transactionHash, returnValues: { amount } }) => {
            this.transactions.push({
              market: symbol,
              price,
              apr: borrowRate,
              transactionHash,
              transactionAmount: Number(amount),
              operation: event,
              decimals,
            })
          })
        })
    },
    getTransactions() {
      //removed - not being used - 2020-12-28
    },
  },
}
</script>
