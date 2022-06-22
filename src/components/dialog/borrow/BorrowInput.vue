<template>
  <div class="borrow-input">
    <template v-if="!waiting">
      <v-row class="inputBox">
        <v-col cols="10">
          <v-text-field
            v-model="amount"
            class="inputText"
            full-width
            single-line
            solo
            flat
            type="number"
            required
            :rules="[
              rules.mustEnterToSomeMarket,
              rules.required,
              rules.decimals,
              rules.marketCash,
              rules.liquidity,
              rules.allowed,
            ]"
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            class="mb-12"
            text
            color="#3e954a"
            :disabled="!oldMaxBorrowAllowed"
            @click="setMaxAmount"
            >max</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="ma-0 my-5 d-flex justify-center">
        <p class="buyMoreTokens">
          Would you like to
          <a target="_blank" href="https://app.rskswap.com/">buy more tokens</a>
        </p>
      </v-row>
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex justify-end">
            <h3>Contract liquidity:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <h1 v-bind="attrs" v-on="on">
                      {{ cash | formatNumber }}
                    </h1>
                  </template>
                  <span>{{ cash }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="5" />
            </v-row>
          </v-col>
          <v-col cols="1">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2" />
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex justify-end">
            <h3>borrow balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1>
                  {{ userTotalBorrow | formatNumber }}
                </h1>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="1">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2" />
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex align-end justify-end">
            <h3>borrow limit:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1>{{ maxBorrowAllowed | formatNumber }}</h1>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="1">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2" />
        </v-row>
      </div>
      <v-row class="my-5 d-flex justify-center">
        <v-btn class="button" rounded color="#3e954a" :disabled="!validForm" @click="borrow">
          Borrow tokens
        </v-btn>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'

export default {
  name: 'BorrowInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hasEnteredToSomeMarket: true,
      waiting: false,
      isAmountMax: false,
      amount: 0,
      userTotalBorrow: 0,
      cash: 0,
      isBorrowAllowed: true,
      oldMaxBorrowAllowed: 0,
      maxBorrowAllowed: 0,
      rules: {
        mustEnterToSomeMarket: () =>
          this.hasEnteredToSomeMarket ||
          'In order to borrow in a market, you must add collateral first.',
        required: () => !!Number(this.amount) || 'Required',
        allowed: () => this.isBorrowAllowed || "Borrow won't be allowed by the protocol",
        decimals: () =>
          this.decimalPositions ||
          `Maximum ${this.data.token.decimals} decimal places for ${this.data.token.symbol}`,
        marketCash: () =>
          Number(this.cash) - Number(this.amount) >= 0 ||
          `This market doesn't have enough ${this.data.token.symbol} liquidity`,
        liquidity: () =>
          Number(this.amount) <= Number(this.maxBorrowAllowed) ||
          "You don't have enough liquidity, supply more collateral to raise your Borrow Limit",
      },
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    validForm() {
      return (
        typeof this.rules.mustEnterToSomeMarket() !== 'string' &&
        typeof this.rules.required() !== 'string' &&
        typeof this.rules.allowed() !== 'string' &&
        typeof this.rules.decimals() !== 'string' &&
        typeof this.rules.marketCash() !== 'string' &&
        typeof this.rules.liquidity() !== 'string'
      )
    },
    hasDecimals() {
      return !!Number(this.data.token.decimals)
    },
    numberOfDecimals() {
      const amount = this.amount.toString()
      return amount.includes('.')
        ? amount.substring(amount.indexOf('.') + 1, amount.length).length <=
            this.data.token.decimals
        : true
    },
    decimalPositions() {
      const amount = this.amount.toString()
      return this.hasDecimals ? this.numberOfDecimals : !amount.includes('.')
    },
  },
  watch: {
    amount() {
      if (this.amount === this.getMaxAmount()) this.isAmountMax = true
      else this.isAmountMax = false
      this.setCalculateApr()
    },
  },
  created() {
    this.cash = this.data.market.totalCash.toString()
    this.data.market.maxBorrowAllowedByAccount(this.account).then((maxBorrowAllowed) => {
      this.maxBorrowAllowed = maxBorrowAllowed.toFixed(
        this.data.token.decimals,
        BigNumber.ROUND_DOWN,
      )
      this.oldMaxBorrowAllowed = this.maxBorrowAllowed
    })

    this.data.market.borrowBalanceCurrentFormatted(this.account).then((borrowBalance) => {
      this.userTotalBorrow = borrowBalance.toString()
    })

    this.$middleware.hasEnteredToSomeMarket(this.account).then((hasEnteredToSomeMarket) => {
      this.hasEnteredToSomeMarket = hasEnteredToSomeMarket
    })
  },
  methods: {
    async borrowAllowed() {
      return this.data.market.borrow(this.amount, true).then((allowed) => {
        if (!!allowed && Number(allowed) !== 0) {
          this.isBorrowAllowed = false // if not allowed, sets internal variable to false
          return this.$middleware.getMsjErrorCodeComptroller(allowed.toHexString())
        }
        return ''
      })
    },
    borrow() {
      // checks if borrowAllowed
      this.borrowAllowed().then((allowed) => {
        if (!allowed) {
          this.isBorrowAllowed = true // probably get rid of this variable alltogether.
          this.$emit('launchTx', {
            promiseAction: this.data.market.borrow(this.amount),
            symbol: this.data.market.token.symbol,
            amount: this.amount,
            nameAction: 'borrowed',
          })
          this.$emit('closeDialog')
        } else {
          const userError = typeof allowed === 'string' ? allowed : allowed.message || ''
          this.$emit('error', {
            userErrorMessage: userError,
          })
        }
      })
    },
    getMaxAmount() {
      return new BigNumber(this.maxBorrowAllowed).gt(this.cash)
        ? Number(this.cash)
        : Number(this.maxBorrowAllowed)
    },
    setMaxAmount() {
      this.isAmountMax = true
      this.amount = this.getMaxAmount()
    },
    async calculateAprWithAmount() {
      return this.data.market.calculateBorrowRate(this.amount).then((calculateApr) => {
        return calculateApr
      })
    },
    async setCalculateApr() {
      if (this.validForm) {
        this.calculateAprWithAmount().then((calculateApr) => {
          this.$emit('setCalulateApr', calculateApr)
        })
      }
    },
  },
}
</script>
