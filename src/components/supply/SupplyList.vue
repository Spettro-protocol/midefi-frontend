<template>
  <v-card class="supply-list" width="80%" flat style="margin: auto">
    <v-list>
      <v-list-item>
        <v-row>
          <v-col cols="4">
            <v-list-item-subtitle class="listTitle">Asset</v-list-item-subtitle>
          </v-col>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">APR</v-list-item-subtitle>
          </v-col>
          <v-col cols="3">
            <v-list-item-subtitle class="listTitle">Supplied</v-list-item-subtitle>
          </v-col>
          <v-col cols="3">
            <v-list-item-subtitle class="listTitle">Price</v-list-item-subtitle>
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider />
      <SupplyItem
        v-for="(market, idx) in markets"
        :key="`market-${idx}`"
        :market="market"
        @dialogClosed="reset"
        v-on="$listeners"
      />
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import SupplyItem from '@/components/supply/SupplyItem.vue'
import * as constants from '@/store/constants'

export default {
  name: 'SupplyList',
  components: {
    SupplyItem,
  },
  data() {
    return {
      markets: [],
      unsubscribeStore: null,
      polling: null,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  beforeDestroy() {
    clearInterval(this.polling)
    if (typeof this.unsubscribeStore === 'function') this.unsubscribeStore()
  },
  async created() {
    // get all markets
    this.markets = await this.$middleware.getMarkets(this.account)
    this.pollData()
    this.unsubscribeStore = this.$store.subscribe((mutation) => {
      if (mutation.type === constants.SNACK_SET_SUCCESS_TX) {
        this.reloadItems()
      }
    })
  },
  methods: {
    pollData() {
      this.polling = setInterval(() => {
        this.reloadItems()
      }, 20000)
    },
    reset() {
      this.$emit('listChange')
    },
    reloadItems() {
      this.$emit('reload')
    },
  },
}
</script>
