<template>
  <v-flex md12 style="overflow: auto">
    <div class="market-list">
      <div v-if="dataLoaded" class="upper-banner">
        <v-list>
          <v-list-item>
            <v-row>
              <v-col>
                <v-list-item-subtitle class="listTitle">Market</v-list-item-subtitle>
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle">Price</v-list-item-subtitle>
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle" title="Loan to Value"
                  >LTV</v-list-item-subtitle
                >
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle" title="Supply Annual Percentage Rate"
                  >Supply APR</v-list-item-subtitle
                >
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle" title="Borrow Annual Percentage Rate"
                  >Borrow APR</v-list-item-subtitle
                >
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle">Total Supplied</v-list-item-subtitle>
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle">Total Borrowed</v-list-item-subtitle>
              </v-col>
              <v-col>
                <v-list-item-subtitle class="listTitle">Contract Liquidity</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider />
          <MarketItem v-for="(market, idx) in markets" :key="`market-${idx}`" :market="market" />
        </v-list>
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
  </v-flex>
</template>

<script>
import MarketItem from '@/components/status/MarketItem.vue'

export default {
  name: 'MarketList',
  components: {
    MarketItem,
  },
  data() {
    return {
      markets: [],
      dataLoaded: false,
    }
  },
  async created() {
    this.markets = await this.$middleware.getMarkets('')
    this.dataLoaded = true
  },
  methods: {
    reloadItems() {
      this.$emit('reload')
    },
  },
}
</script>
