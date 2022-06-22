<template>
  <div class="supply-item dialog">
    <v-list-item>
      <v-row class="my-5 mx-0 d-flex align-center">
        <v-col cols="4">
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
              <v-list-item-subtitle class="item d-flex justify-start">
                {{ token.symbol }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ supplyRate | formatPercentage }}
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="3" class="px-0">
          <v-row class="ma-0">
            <v-list-item-subtitle class="item">
              {{ tokenBalance | formatNumber }}
            </v-list-item-subtitle>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-list-item-subtitle class="item">
            {{ price | formatPrice }}<span class="ml-2 itemInfo">usd</span>
          </v-list-item-subtitle>
        </v-col>
      </v-row>
    </v-list-item>
    <v-divider />
    <template v-if="dialog">
      <SupplyDialog :data="dataObject" @closed="reset" v-on="$listeners" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SupplyDialog from '@/components/dialog/supply/SupplyDialog.vue'

export default {
  name: 'SupplyItem',
  components: {
    SupplyDialog,
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
      dialog: false,
      tokenBalance: 0,
      currentComponent: 'SupplyList',
      supplyValue: 0,
      getFunds: false,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    dataObject() {
      return {
        flag: this.dialog,
        supplyRate: this.supplyRate,
        price: this.price,
        token: this.token,
        market: this.market,
      }
    },
  },
  mounted() {
    this.$parent.$parent.$parent.$on('reload', this.reload)
  },
  created() {
    // set data token
    this.token = this.market.token
    this.market
      .getUserBalanceOfUnderlying()
      .then((balance) => {
        this.tokenBalance = balance
        this.getFunds = Number(this.tokenBalance) > 0
        return this.market.getPriceInDecimals()
      })
      // set price
      .then((price) => {
        this.price = price
        return this.market.getSupplyRate()
      })
      // set borrow rate block
      .then((supplyRate) => {
        this.supplyRate = supplyRate
      })
  },
  methods: {
    reset() {
      this.dialog = false
      this.reload()
      this.$emit('dialogClosed')
    },
    reload() {
      this.market
        .getUserBalanceOfUnderlying()
        .then((balance) => {
          this.tokenBalance = balance
          this.getFunds = Number(this.tokenBalance) > 0
          return this.market.getPriceInDecimals()
        })
        // set price
        .then((price) => {
          this.price = price
          return this.market.getSupplyRate()
        })
        // set borrow rate block
        .then((supplyRate) => {
          this.supplyRate = supplyRate
        })
    },
  },
}
</script>
