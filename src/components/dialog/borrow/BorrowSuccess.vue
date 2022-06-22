<template>
  <div class="borrow-success">
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully borrowed <br />
          <span class="greenish">
            {{ data.borrowed | formatNumber }}
          </span>
          <span class="greenish">{{ data.token.symbol }}</span>
          from this Market.
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex justify-end">
          <h3>borrow balance:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ userTotalBorrow | formatNumber }}</h1>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2" />
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2" />
        <v-col cols="3" class="d-flex justify-end">
          <h3>supplied to contract:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ tokenBalance | formatNumber }}</h1>
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
import BigNumber from 'bignumber.js'

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
      tokenBalance: 0,
      maxBorrowAllowed: 0,
      userTotalBorrow: 0,
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
      .then((balance) => {
        this.tokenBalance = balance
        return this.data.market.borrowBalanceCurrentFormatted(this.account)
      })
      .then((borrowBy) => {
        this.userTotalBorrow = borrowBy
        return this.data.market.maxBorrowAllowedByAccount(this.account)
      })
      .then((maxBorrowAllowed) => {
        this.maxBorrowAllowed = maxBorrowAllowed.toFixed(
          this.data.token.decimals,
          BigNumber.ROUND_DOWN,
        )
      })
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>
