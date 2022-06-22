<template>
  <div class="repay-success">
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully repayed <br />
          <span class="greenish">
            {{ data.pay | formatNumber }}
          </span>
          <span class="greenish">{{ data.token.symbol }}</span>
          to this Market.
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex justify-end">
          <h3>health factor:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ healthFactor }}%</h1>
        </v-col>
        <v-col cols="2" />
        <v-col cols="2" />
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex justify-end">
          <h3>borrow balance:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ totalBorrow | formatNumber }}</h1>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2" />
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex align-end justify-end">
          <h3>borrow limit:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ maxBorrowAllowed | formatNumber }}</h1>
        </v-col>
        <v-col cols="2">
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
import { ethers } from 'ethers'

export default {
  name: 'BorrowSuccess',
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
      maxBorrowAllowed: 0,
      totalBorrow: 0,
      accountHealth: 0,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    healthFactor() {
      return this.accountHealth >= 1 ? 100 : (this.accountHealth * 100).toFixed(2)
    },
  },
  created() {
    this.data.market
      .borrowBalanceCurrent(this.account)
      .then((borrow) => {
        this.totalBorrow = ethers.utils.formatUnits(borrow, this.data.market.token.decimals)
        return this.data.market.maxBorrowAllowedByAccount(this.account)
      })
      .then((maxBorrowAllowed) => {
        this.maxBorrowAllowed = maxBorrowAllowed
        return this.$middleware.getAccountHealth(this.account)
      })
      .then((health) => {
        this.accountHealth = health
      })
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>
