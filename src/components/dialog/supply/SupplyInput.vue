<template>
  <div class="supply-input">
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
            type="text"
            required
            :rules="[rules.required, rules.decimals, rules.minBalance]"
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            class="mb-12"
            text
            color="#3e954a"
            :disabled="!maxBorrowAllowed"
            @click="setMaxAmount"
            >max</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="ma-0 my-5 d-flex justify-center">
        <p class="buyMoreTokens">
          Would you like to
          <a target="_blank" href="https://app.rskswap.com/">buy more tokens?</a>
        </p>
      </v-row>
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex justify-end">
            <h3>apr:</h3>
          </v-col>
          <v-col cols="4">
            <v-col cols="7" class="d-flex justify-center">
              <h1>{{ supplyRate | formatPercentage }}</h1>
            </v-col>
            <v-col cols="5" />
          </v-col>
          <v-col cols="1" />
          <v-col cols="2" />
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2" />
          <v-col cols="3" class="d-flex justify-end">
            <h3>supply balance:</h3>
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
            <h3>max supply:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1 :title="[`Max to supply: ${maxAmountBalanceAllowed} ${data.token.symbol}`]">
                  {{ maxAmountBalanceAllowed | formatNumber }}
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
        <v-btn v-else class="button" rounded color="#3e954a" :disabled="!validForm" @click="supply">
          Supply tokens
        </v-btn>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'

export default {
  name: 'SupplyInput',
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
      maxAmountBalanceAllowed: 0,
      supplyRate: 0,
      maxBorrowAllowed: 0,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
      needApproval: true,
      approveDialog: false,
      polling: null,
      rules: {
        required: () => (!!Number(this.amount) && Math.sign(this.amount) == 1) || 'Required',
        decimals: () =>
          this.decimalPositions ||
          `Maximum ${this.data.token.decimals} decimal places for ${this.data.token.symbol}`,
        minBalance: () =>
          Number(this.maxAmountBalanceAllowed) >= Number(this.amount) || 'Not enough funds',
      },
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    validForm() {
      return (
        typeof this.rules.minBalance() !== 'string' &&
        typeof this.rules.required() !== 'string' &&
        typeof this.rules.decimals() !== 'string'
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
      this.getValues()
      if (this.amount === this.getMaxAmount()) this.isAmountMax = true
      else this.isAmountMax = false
      this.setCalculateApr()
    },
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  created() {
    this.data.market
      .isAllowance(this.account)
      .then((allow) => {
        this.needApproval = !allow
        return this.data.market.getSupplyRate(false)
      })
      .then((supplyRate) => {
        this.supplyRate = supplyRate
        return this.data.market.getUserBalanceOfUnderlying()
      })
      .then((tokenBalance) => {
        this.tokenBalance = tokenBalance
        console.log('tokenBalance', tokenBalance)
        return this.data.market.maxBorrowAllowedByAccount(this.account)
      })
      .then((maxBorrowAllowed) => {
        this.maxBorrowAllowed = maxBorrowAllowed.toFixed(
          this.data.token.decimals,
          BigNumber.ROUND_DOWN,
        )
        console.log('maxBorrowAllowed', this.maxBorrowAllowed)
        return !this.data.market.ismiFTM
          ? this.$middleware.getWalletAccountBalance(
              this.account,
              this.data.market.token?.address,
              this.data.market.token?.decimals,
            )
          : this.$middleware.getWalletAccountBalanceForEther(this.account)
      })
      .then((balanceOfToken) => {
        console.log('market', this.data.market)
        console.log('balanceOfToken', balanceOfToken)
        if (this.data.market.ismiFTM) {
          this.$middleware.getGasPrice().then((price) => {
            // balanceOfToken - (gasPrice * gasLimit * 2)
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
    supply() {
      this.$emit('launchTx', {
        promiseAction: this.data.market.supply(this.amount),
        symbol: this.data.market.token.symbol,
        amount: this.amount,
        nameAction: 'supplied',
      })
      this.$emit('closeDialog')
    },
    asDouble(value) {
      return (Number(value) / 10 ** this.data.token.decimals).toFixed(this.data.token.decimals)
    },
    async getValues() {
      this.data.market.getSupplyRate().then((supplyRate) => {
        //set apr
        this.supplyRate = supplyRate
      })

      this.data.market.maxBorrowAllowedByAccount(this.account).then((maxBorrowAllowed) => {
        //set borrow limit
        this.maxBorrowAllowed = maxBorrowAllowed.toFixed(
          this.data.token.decimals,
          BigNumber.ROUND_DOWN,
        )
      })
      //set token balance
      this.data.market.getUserBalanceOfUnderlying().then((balance) => {
        this.tokenBalance = balance
      })
    },
    getMaxAmount() {
      return this.maxAmountBalanceAllowed
    },
    setMaxAmount() {
      this.isAmountMax = true
      this.amount = this.getMaxAmount()
    },
    async calculateAprWithAmount() {
      return this.data.market.calculateSupplyRate(this.amount).then((calculateApr) => {
        return calculateApr
      })
    },
    async setCalculateApr() {
      if (this.validForm) {
        this.calculateAprWithAmount().then((calculateApr) => {
          this.supplyRate = calculateApr
        })
        if (!this.polling) this.pollData()
      }
    },

    pollData() {
      this.polling = setInterval(async () => {
        await this.setCalculateApr()
      }, 10000)
    },
  },
}
</script>
