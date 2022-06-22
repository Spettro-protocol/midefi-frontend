<template>
  <div class="market-item dialog">
    <v-list-item class="pa-0">
      <v-row class="my-5 mx-0 d-flex align-center">
        <v-col>
          <v-row class="d-flex align-center">
            <v-col cols="6" class="pa-0 d-flex justify-end">
              <v-list-item-avatar tile size="40">
                <v-img
                  :src="require(`@/assets/tokens/${token.logo}.png`)"
                  :alt="`token ${token.logo} icon`"
                />
              </v-list-item-avatar>
            </v-col>
            <v-col cols="6" class="pa-0 d-flex justify-start">
              <v-list-item-subtitle class="itemStatus d-flex justify-start">
                {{ token.symbol }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-list-item-subtitle class="itemStatus">
            {{ price | formatPrice }}<span class="ml-2 itemInfo">usd</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col>
          <v-list-item-subtitle class="itemStatus">
            {{ loanToValue | formatPercentage }}
          </v-list-item-subtitle>
        </v-col>
        <v-col>
          <v-list-item-subtitle class="itemStatus">
            {{ supplyRate | formatPercentage }}
          </v-list-item-subtitle>
        </v-col>
        <v-col>
          <v-list-item-subtitle class="itemStatus">
            {{ borrowRate | formatPercentage }}
          </v-list-item-subtitle>
        </v-col>
        <v-col>
          <v-list-item-subtitle class="itemStatus">
            {{ totalSupply | formatNumber }}
            <span class="ml-2 itemInfo">{{ token.symbol }}</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col>
          <v-list-item-subtitle class="itemStatus">
            {{ totalBorrows | formatNumber }}
            <span class="ml-2 itemInfo">{{ token.symbol }}</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col class="px-0">
          <v-row class="ma-0">
            <v-col cols="10" class="pa-0 d-flex align-center">
              <v-list-item-subtitle class="itemStatus">
                {{ cash | formatNumber }}
                <span class="ml-2 itemInfo">{{ token.symbol }}</span>
              </v-list-item-subtitle>
            </v-col>
            <v-col cols="2" class="pa-0">
              <v-btn class="pa-0 ma-0" icon @click="dialog = !dialog">
                <svg
                  width="11"
                  height="32"
                  viewBox="0 0 11 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L9 16L1 31"
                    stroke="#3e954a"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-list-item>
    <v-divider />
    <template v-if="dialog">
      <MarketDialog :data="dataObject" @closed="reset" />
    </template>
  </div>
</template>

<script>
import MarketDialog from '@/components/dialog/market/MarketDialog.vue'

export default {
  name: 'MarketItem',
  components: {
    MarketDialog,
  },
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      token: {
        name: null,
        symbol: null,
        decimals: 0,
        logo: null,
      },
      price: 0,
      supplyRate: 0,
      borrowRate: 0,
      loanToValue: 0,
      cash: 0, // current contract liquidity
      totalSupply: 0,
      totalBorrows: 0,
      dialog: false,
    }
  },
  computed: {
    dataObject() {
      return {
        flag: this.dialog,
        token: this.token,
        market: this.market,
      }
    },
  },
  mounted() {
    this.$parent.$parent.$on('reload', this.reset)
  },
  async created() {
    this.token = this.market.token
    this.price = await this.market.getPriceInDecimals()
    this.supplyRate = await this.market.getSupplyRate(false)
    this.borrowRate = await this.market.getBorrowRate(false)
    this.cash = this.market.totalCash
    this.totalSupply = await this.market.getTotalSupplyInUnderlying(false)
    this.totalBorrows = this.market.totalBorrows
    this.loanToValue = this.market.loanToValue.multipliedBy(100)
  },
  methods: {
    reset() {
      this.dialog = false
      this.market
        .getPriceInDecimals()
        .then((marketPrice) => {
          this.price = marketPrice
          return this.market.getBorrowRate()
        })
        .then((borrowRate) => {
          this.borrowRate = borrowRate
          this.cash = this.market.totalCash
          this.totalBorrows = this.market.totalBorrows
          this.loanToValue = this.market.loanToValue
          return this.market.getTotalSupplyInUnderlying()
        })
        .then((totalSupply) => {
          this.totalSupply = totalSupply
        })
      this.$emit('dialogClosed')
    },
  },
}
</script>
