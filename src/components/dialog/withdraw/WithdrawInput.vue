<template>
  <div>
    <template v-if="!waiting">
      <v-row class="withdraw-input inputBox">
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
              rules.required,
              rules.decimals,
              rules.marketSupply,
              rules.userSupply,
              rules.userDebts,
            ]"
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            class="mb-12"
            text
            color="#3e954a"
            :disabled="!maxWithdrawAllowed"
            @click="setMaxAmount"
            >max</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="my-5" />
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex justify-end">
            <h3>Contract Liquidity:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1 :title="[`Balance: ${cash} ${data.token.symbol}`]">
                  {{ cash | formatNumber }}
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
          <v-col cols="3" class="d-flex justify-end">
            <h3>Supply Balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1 :title="[`Balance ${tokenBalance} ${data.token.symbol}`]">
                  {{ tokenBalance | formatNumber }}
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
                <h1 :title="[`Borrow limit: ${maxBorrowAllowed} ${data.token.symbol}`]">
                  {{ maxBorrowAllowed | formatNumber }}
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
          <v-col cols="3" class="d-flex justify-end">
            <h3>max withdraw:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1 :title="[`Max to withdraw: ${getMaxAmount()} ${data.token.symbol}`]">
                  {{ getMaxAmount() | formatNumber }}
                </h1>
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
        <v-btn class="button" rounded color="#3e954a" :disabled="!validForm" @click="withdraw">
          Withdraw my tokens
        </v-btn>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export default {
  name: 'WithdrawInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiting: false,
      maxAmount: false,
      amount: '0',
      supplyOf: 0,
      cash: 0,
      maxBorrowAllowed: 0,
      maxWithdrawAllowed: 0,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
      collateralFactor: 0,
      mantissa: 0,
      oldSupplyOf: 0,
      supplyValue: 0,
      borrowValue: 0,
      debt: 0,
      rules: {
        required: () => (!!Number(this.amount) && Math.sign(this.amount) == 1) || 'Required',
        decimals: () =>
          this.decimalPositions ||
          `Maximum ${this.data.token.decimals} decimal places for ${this.data.token.symbol}`,
        marketSupply: () =>
          Number(this.cash) >= Number(this.amount) || 'Market does not have enough funds',
        userSupply: () =>
          Number(this.tokenBalance) >= Number(this.amount) ||
          'You do not have enough funds on this market',
        userDebts: () =>
          Number(this.tokenBalance) - Number(this.debt) >= Number(this.amount) ||
          'You can not withdraw that much, because is compromised as collateral in a debt',
      },
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    validForm() {
      return (
        typeof this.rules.required() !== 'string' &&
        typeof this.rules.decimals() !== 'string' &&
        typeof this.rules.marketSupply() !== 'string' &&
        typeof this.rules.userDebts() !== 'string' &&
        typeof this.rules.userSupply() !== 'string'
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
    this.data.market.getUserBalanceOfUnderlying().then((balance) => {
      this.tokenBalance = balance
    })

    this.data.market.maxBorrowAllowedByAccount(this.account).then((maxBorrowAllowed) => {
      this.maxBorrowAllowed = maxBorrowAllowed.toFixed(
        this.data.token.decimals,
        BigNumber.ROUND_DOWN,
      )
    })

    this.data.market.getMaxWithdrawAllowed(this.account).then((maxRedeemAllowed) => {
      this.maxWithdrawAllowed = maxRedeemAllowed.toFixed(this.data.market.token.decimals)
    })

    this.data.market.getMarketCash().then((cash) => {
      this.cash = cash.toString()
    })

    this.data.market
      .borrowBalanceCurrent(this.account)
      .then((borrowValue) => {
        // TODO format
        this.borrowValue = new BigNumber(ethers.utils.formatEther(borrowValue))
        return this.data.market.getCurrentExchangeRate()
      })
      // sets mantissa
      .then((mantissa) => {
        this.mantissa = mantissa
        // set collateralFactor
        this.collateralFactor = this.data.market.collateralFactorMantissa.multipliedBy(
          this.mantissa,
        )
        // sets debt
        this.debt = this.borrowValue
          .multipliedBy(this.mantissa.plus(this.collateralFactor))
          .div(this.mantissa)
          .toString()
        return this.data.market.getMaxWithdrawAllowed(this.account)
      })
  },
  methods: {
    async withdrawAllow(amountUnderlying) {
      return this.data.market.withdraw(amountUnderlying, true).then((allowed) => {
        if (!!allowed && Number(allowed) !== 0) {
          return this.$middleware.getMsjErrorCodeComptroller(allowed.toHexString())
        }
        return ''
      })
    },
    withdraw() {
      this.withdrawAllow(this.amount).then((allowed) => {
        if (!allowed) {
          this.$emit('launchTx', {
            promiseAction: this.data.market.withdraw(this.amount, false),
            symbol: this.data.market.token.symbol,
            amount: this.amount,
            nameAction: 'withdrawn',
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
      return this.maxWithdrawAllowed
    },
    setMaxAmount() {
      this.isAmountMax = true
      this.amount = this.getMaxAmount()
    },
    async calculateAprWithAmount() {
      return this.data.market.calculateSupplyRate(-this.amount).then((calculateApr) => {
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
