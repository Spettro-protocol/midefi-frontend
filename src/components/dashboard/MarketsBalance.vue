<template>
  <div class="markets-balance">
    <div class="d-flex justify-center">
      <h1>Balance</h1>
    </div>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="(market, idx) in marketAddresses"
          :key="`market-balance-item-${idx}`"
          cols="4"
        >
          <MarketBalanceItem :market-address="market" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarketBalanceItem from '@/components/dashboard/MarketBalanceItem.vue'

export default {
  name: 'MarketsBalance',
  components: {
    MarketBalanceItem,
  },
  data() {
    return {
      marketAddresses: [],
    }
  },
  created() {
    //removed - not being used - 2020-12-28
  },
}
</script>
