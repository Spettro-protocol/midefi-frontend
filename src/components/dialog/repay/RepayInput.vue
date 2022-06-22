<template>
  <div class="repay-input">
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
              rules.required,
              rules.decimals,
              rules.debtExists,
              rules.notBiggerThanDebt,
              rules.hasEnoughTokens,
            ]"
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            class="mb-12"
            text
            color="#3e954a"
            :disabled="!userTotalBorrow"
            @click="setMaxAmount"
            >max</v-btn
          >
        </v-col>
      </v-row>
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex justify-end">
            <h3>health factor:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1>{{ healthFactor }}%</h1>
              </v-col>
              <v-col cols="5" />
            </v-row>
          </v-col>
          <v-col cols="1" />
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
                <h1>{{ userTotalBorrow | formatNumber }}</h1>
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
        <v-btn
          v-if="needApproval"
          class="button"
          rounded
          color="#00A24D"
          :disabled="!validForm"
          @click="approve"
        >
          Approve
        </v-btn>
        <v-btn v-else class="button" rounded color="#3e954a" :disabled="!validForm" @click="repay">
          Repay tokens
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
  name: 'RepayInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiting: false,
      isAmountMax: false,
      amount: '0',
      userTotalBorrow: 0,
      maxBorrowAllowed: 0,
      borrowBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
      accountHealth: 0,
      maxAmountBalanceAllowed: 0,
      needApproval: true,
      approveDialog: false,
      rules: {
        required: () => !!Number(this.amount) || 'Required',
        decimals: () =>
          this.decimalPositions ||
          `Maximum ${this.data.token.decimals} decimal places for ${this.data.token.symbol}`,
        debtExists: () =>
          (this.userTotalBorrow > 0 && !!this.contractAmount) ||
          'You do not have a debt on this market',
        hasEnoughTokens: () =>
          Number(this.maxAmountBalanceAllowed) >= Number(this.amount) ||
          `You do not have enough ${this.data.token.symbol}`,
        notBiggerThanDebt: () =>
          this.userTotalBorrow >= Number(this.amount) || 'You do not owe that much',
      },
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    healthFactor() {
      return this.accountHealth >= 1 ? 100 : (this.accountHealth * 100).toFixed(2)
    },
    contractAmount() {
      return Number(this.amount).toFixed(this.data.token.decimals).replace('.', '')
    },
    validForm() {
      return (
        typeof this.rules.required() !== 'string' &&
        typeof this.rules.decimals() !== 'string' &&
        typeof this.rules.debtExists() !== 'string' &&
        typeof this.rules.hasEnoughTokens() !== 'string' &&
        typeof this.rules.notBiggerThanDebt() !== 'string'
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
    this.$middleware.getAccountHealth(this.account).then((health) => {
      this.accountHealth = health
    })

    //set is market allow
    this.data.market.isAllowance(this.account).then((allow) => {
      this.needApproval = !allow
    })

    this.data.market.maxBorrowAllowedByAccount(this.account).then((maxBorrowAllowed) => {
      this.maxBorrowAllowed = maxBorrowAllowed
    })
    this.data.market.borrowBalanceCurrentFormatted(this.account).then((borrowBalance) => {
      this.userTotalBorrow = borrowBalance.toString()
    })
    const walletBalancePromise = !this.data.market.ismiFTM
      ? this.$middleware.getWalletAccountBalance(
          this.account,
          this.data.market.token?.address,
          this.data.market.token?.decimals,
        )
      : this.$middleware.getWalletAccountBalanceForEther(this.account)
    walletBalancePromise.then((balanceOfToken) => {
      if (this.data.market.ismiFTM) {
        this.$middleware.getGasPrice().then((price) => {
          // balanceOfToken - (gasPrice * gasLimit)
          const max = new BigNumber(balanceOfToken).minus(
            price.multipliedBy(this.data.market.gasLimit).multipliedBy(2),
          )
          this.maxAmountBalanceAllowed = max.isNegative() ? 0 : max.toString()
        })
      } else {
        this.maxAmountBalanceAllowed = new BigNumber(balanceOfToken).toString()
      }
    })
  },
  methods: {
    closeTemplateApprove() {
      this.waiting = false
      this.approveDialog = false
      this.$emit('approve')
    },
    approve() {
      this.$emit('launchTx', {
        promiseAction: this.data.market.approveWithMaxUint(),
        symbol: this.data.market.token.symbol,
        isApprove: true,
      })
      this.$emit('closeDialog')
    },
    repay() {
      //get amount
      this.validateMaxToRepay()
        .then((amount) => {
          this.$emit('launchTx', {
            promiseAction: this.data.market.payBorrow(amount),
            symbol: this.data.market.token.symbol,
            amount: amount,
            nameAction: 'repayed',
          })
          this.$emit('closeDialog')
        })
        .catch((error) => {
          // validate user error message
          const userError = typeof error === 'string' ? error : error.message || ''
          this.$emit('error', {
            userErrorMessage: userError,
          })
          this.waiting = false
        })
    },
    async validateMaxToRepay() {
      //validate if max
      if (!this.isAmountMax) return this.amount
      //validate if amount !== maxBorrow
      if (this.userTotalBorrow !== this.amount) return this.amount
      //get the max borrow again
      return this.data.market.borrowBalanceCurrent(this.account).then((borrowBalance) => {
        return ethers.utils.formatUnits(borrowBalance, this.data.market.token.decimals)
      })
    },
    getMaxAmount() {
      console.log('userTotalBorrow', this.userTotalBorrow)
      console.log('maxAmountBalanceAllowed', this.maxAmountBalanceAllowed)
      return ethers.utils
        .parseUnits(this.userTotalBorrow, this.data.market.token.decimals)
        .lte(ethers.utils.parseUnits(this.maxAmountBalanceAllowed, this.data.market.token.decimals))
        ? this.userTotalBorrow
        : this.maxAmountBalanceAllowed
    },
    setMaxAmount() {
      this.isAmountMax = true
      this.amount = this.getMaxAmount()
    },
    async calculateAprWithAmount() {
      return this.data.market.calculateBorrowRate(-this.amount).then((calculateApr) => {
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
