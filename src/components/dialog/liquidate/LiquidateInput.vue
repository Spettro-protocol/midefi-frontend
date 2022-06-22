<template>
  <div class="liquidate-input">
    <template v-if="!waiting">
      <LiquidateList v-if="!accountSelected" :data="data" @selected="setLiquidationAccount" />
      <div v-else>
        <v-row class="mx-6 px-6 mb-3">
          <h1>Collateral Available to liquidate:</h1>
        </v-row>
        <v-row class="mx-6 px-6">
          <p class="text-justify">
            As collaterals are not necessarily expressed in the same token as the market, you may
            need to liquidate them in other tokens.
          </p>
        </v-row>
        <v-row class="my-4 d-flex align-center">
          <v-col cols="8" class="input-col dialogInputLiquidate">
            <v-row class="inputBox mb-4">
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
                    rules.collateralMarketSelected,
                    rules.required,
                    rules.decimals,
                    rules.funds,
                    rules.maxAvailable,
                  ]"
                />
              </v-col>
              <v-col cols="2" class="mb-6 ml-0">
                <v-btn text color="#3e954a" @click="max = true">max</v-btn>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-1 d-flex align-center">
              <v-col cols="2">
                <h4>You pay:</h4>
              </v-col>
              <v-col cols="8" class="summary-num d-flex justify-center">
                {{ collateralAmount | formatNumber }}
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>{{ borrowMarketSymbol }}</span>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-1 pt-1 d-flex align-center">
              <v-col cols="2" />
              <v-col cols="8" class="d-flex justify-center">
                <span>
                  {{ usdAmount | formatPrice }}
                </span>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span> USD </span>
              </v-col>
            </v-row>

            <v-row class="mx-0 mt-4 px-1 d-flex align-center">
              <v-col cols="2">
                <h4>You get:</h4>
              </v-col>
              <v-col v-show="!marketSelected" cols="7" class="summary-num d-flex justify-center">
                {{ selectCollateralAmount }}
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <div>
                  <v-select
                    v-model="marketSelected"
                    :items="getAvailableMarketBorrower"
                    item-text="text"
                    item-value="value"
                    attach="attach"
                  >
                  </v-select>
                </div>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-1 pt-1 d-flex align-center">
              <v-col cols="2" />
              <v-col cols="8" class="d-flex justify-center">
                <span>
                  {{ usdAmount | formatPrice }}
                </span>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span> USD </span>
              </v-col>
            </v-row>
            <v-row class="px-1 mt-6 d-flex justify-center">
              <h5 class="buyMoreTokens">
                Would you like to
                <a target="_blank" href="https://app.rskswap.com/">buy more tokens?</a>
              </h5>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="my-6 d-flex justify-center">
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
          <v-btn
            v-else
            class="button"
            rounded
            color="#3e954a"
            :disabled="!validForm"
            @click="liquidate"
          >
            Liquidate account
          </v-btn>
        </v-row>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LiquidateList from '@/components/dialog/liquidate/LiquidateList.vue'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { cTokensDetails } from '../../../middleware/constants'
import * as Sentry from '@sentry/browser'

export default {
  name: 'LiquidateInput',
  components: {
    LiquidateList,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      marketSelected: '',
      availableMarketBorrower: [],
      availableMarketBalances: [],
      waiting: false,
      liquidationAccount: '',
      accountSelected: false,
      accountDebt: 0,
      borrowMarketAddress: '',
      borrowMarketPrice: 0,
      currentMarketPrice: 0,
      borrowMarketTokenDecimals: 0,
      maxCollateralSupplied: 0,
      closeFactor: 0,
      borrowMarketSymbol: '',
      cMarketSymbol: '',
      amount: '0',
      funds: 0,
      max: false,
      needApproval: true,
      approveDialog: false,
      rules: {
        collateralMarketSelected: () => !!this.marketSelected || 'Select collateral market',
        required: () => !!Number(this.amount) || 'Required',
        decimals: () =>
          this.decimalPositions ||
          `Maximum ${this.data.token.decimals} decimal places for ${this.data.token.symbol}`,
        funds: () => this.funds >= this.usdAmount / this.borrowMarketPrice || 'Not enough funds',
        maxAvailable: () =>
          this.amount <= this.maxToLiquidate() || 'There is not enough collateral to liquidate',
      },
      selected: { text: 'Choose...', disabled: true },
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    validForm() {
      return (
        typeof this.rules.collateralMarketSelected() !== 'string' &&
        typeof this.rules.funds() !== 'string' &&
        typeof this.rules.decimals() !== 'string' &&
        typeof this.rules.required() !== 'string' &&
        typeof this.rules.maxAvailable() !== 'string'
      )
    },
    usdAmount() {
      return !this.amount ? 0 : this.currentMarketPrice.multipliedBy(this.amount).toNumber()
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
    contractAmount() {
      return this.borrowMarketTokenDecimals
        ? this.amount / 10 ** this.borrowMarketTokenDecimals
        : this.amount
    },
    collateralAmount() {
      // return
      return !this.amount
        ? 0
        : this.currentMarketPrice.multipliedBy(this.amount).div(this.borrowMarketPrice).toNumber()
    },
    selectCollateralAmount() {
      return !this.amount || !this.marketSelected
        ? 0
        : this.currentMarketPrice
            .multipliedBy(this.amount)
            .div(this.getCollateralMarketPriceAssetSelected())
            .toNumber()
            .toFixed(18)
    },
    liquidationAmount() {
      return this.amount
    },
    getAvailableMarketBorrower() {
      var defaultOpt = {}
      defaultOpt.text = 'Choose...'
      defaultOpt.value = ''
      defaultOpt.disabled = true
      var newAvailableMarketBorrower = Array.from(this.data.availableMarketBorrower)
      newAvailableMarketBorrower.unshift(defaultOpt)

      return newAvailableMarketBorrower
    },
  },
  watch: {
    max() {
      //TODO change max value use
      this.amount = this.maxToLiquidate()
      this.max = false
    },
    marketSelected() {
      this.$middleware
        .isAccountAllowanceInMarket(this.account, this.getCollateralMarketSymbolAssetSelected())
        .then((allow) => {
          this.needApproval = !allow
        })
    },
  },
  methods: {
    approve() {
      this.$emit('launchTx', {
        promiseAction: this.$middleware.approveMarketWithMaxUint(
          this.getCollateralMarketSymbolAssetSelected(),
        ),
        symbol: this.data.market.token.symbol,
        isApprove: true,
      })
      this.$emit('closeDialog')
    },

    maxToLiquidate() {
      if (!this.marketSelected) return 0
      // total borrow * close factor
      const borrowPerCloseFactor = this.setMaxClose(
        new BigNumber(this.closeFactor)
          .multipliedBy(this.maxCollateralSupplied)
          .div(this.currentMarketPrice),
      ).toNumber()
      //max calcultate supplied in contract by market of borrower
      const maxAssetCollateralBorrower = this.getCollateralMarketPriceAssetSelected()
        .multipliedBy(this.getCollateralMarketMaxAssetSelected())
        .div(this.currentMarketPrice)
        .toNumber()
      //calculate MIN
      return Math.min(
        //max borrow by borrower
        this.maxCollateralSupplied,
        borrowPerCloseFactor,
        maxAssetCollateralBorrower,
        //founds of liquidator
        Number(this.funds),
      )
    },

    async liquidateAllowed() {
      return this.$middleware
        .liquidateBorrowAllowed(
          this.liquidationAccount,
          this.account,
          this.collateralAmount,
          this.borrowMarketAddress,
          this.marketSelected.toString(),
        )
        .then((allowed) => {
          allowed = allowed.toNumber()
          // validate allowed
          if (allowed === 0) {
            return ''
          }
          return this.$middleware.getMsjErrorCodeComptroller(allowed)
        })
    },

    liquidate() {
      const market = this.data.market
      //call allow liquidate
      this.liquidateAllowed().then((allowed) => {
        // validate allowed
        if (!allowed) {
          //liquidate
          this.$emit('launchTx', {
            promiseAction: market.liquidateBorrow(
              this.liquidationAccount,
              this.collateralAmount,
              this.marketSelected.toString(),
            ),
            symbol: this.getCollateralMarketSymbolAssetSelected(),
            amount: this.collateralAmount,
            nameAction: 'liquidated',
          })
          this.$emit('closeDialog')
        } else {
          const userError = typeof allowed === 'string' ? allowed : allowed.message || ''
          this.$emit('error', { userErrorMessage: userError, amount: this.selectCollateralAmount })
        }
      })
    },
    setLiquidationAccount(accountObject) {
      this.cMarketSymbol = this.data.market.symbol
      //set address market to liquidate
      this.borrowMarketAddress = accountObject.borrowMarketAddress
      //set token data
      this.getCollateralToken(accountObject)
      //get the asset of borrower
      this.assetsBalanceIn(accountObject.borrower)
        .then((balances) => {
          this.data.availableMarketBalances = balances
          //set price market to liquidate
          return accountObject.collateral.getPriceInDecimals()
        })
        .then((price) => {
          this.borrowMarketPrice = price
          //set the asset amount of the account to liquidate
          //cast to BigNumberJS, because price express in decimals BigNumberJS
          this.accountDebt = new BigNumber(
            ethers.utils.formatEther(accountObject.debt),
          ).multipliedBy(price)
          return this.data.market.getPriceInDecimals()
        })
        //set the price of current market
        .then((price) => {
          this.currentMarketPrice = price
          //set the borrow of the account to liquidate => maxToLiquidate
          //cast to BigNumberJS, because price express in decimals BigNumberJS
          this.maxCollateralSupplied = new BigNumber(
            ethers.utils.formatEther(accountObject.maxToLiquidate),
          ).multipliedBy(price)
          this.accountSelected = true
          this.liquidationAccount = accountObject.borrower
          return this.$middleware.getLiquidationFactor()
        })
        .then((closeFactor) => {
          //cast to BigNumberJS,
          this.closeFactor = new BigNumber(ethers.utils.formatEther(closeFactor))
        })
    },
    assetsBalanceIn(account) {
      return this.$middleware.getAssetsBalanceIn(account).then((balances) => {
        this.data.availableMarketBorrower = balances.map((balance) => ({
          value: balance.marketAddress,
          text: balance.symbol,
        }))
        return balances
      })
    },
    actionSucceed(succeedObj) {
      this.emit('succeed', succeedObj)
    },
    getCollateralToken(accountObject) {
      this.borrowMarketSymbol = accountObject.collateral.token.symbol
      this.borrowMarketTokenDecimals = accountObject.collateral.token.decimals

      const walletBalancePromise = !accountObject.collateral.ismiFTM
        ? this.$middleware.getWalletAccountBalance(
            this.account,
            accountObject.collateral.token.address,
            accountObject.collateral.token.decimals,
          )
        : this.$middleware.getWalletAccountBalanceForEther(this.account)
      walletBalancePromise.then((balanceOfToken) => {
        if (this.data.market.ismiFTM) {
          this.$middleware.getGasPrice().then((price) => {
            // balanceOfToken - (gasPrice * gasLimit)
            const max = new BigNumber(balanceOfToken).minus(
              price.multipliedBy(this.data.market.gasLimit),
            )
            this.funds = max.isNegative() ? 0 : max.toString()
          })
        } else {
          this.funds = new BigNumber(balanceOfToken).toString()
        }
      })
    },
    getCollateralMarketMaxAssetSelected() {
      try {
        return this.data.availableMarketBalances.find(
          (market) => market.marketAddress === this.marketSelected.toString(),
        ).balance
      } catch (error) {
        Sentry.captureException(error)
        return ''
      }
    },
    getCollateralMarketPriceAssetSelected() {
      try {
        return this.data.availableMarketBalances.find(
          (market) => market.marketAddress === this.marketSelected.toString(),
        ).price
      } catch (error) {
        Sentry.captureException(error)
        return ''
      }
    },
    getCollateralMarketSymbolAssetSelected() {
      try {
        return this.data.availableMarketBalances.find(
          (market) => market.marketAddress === this.marketSelected.toString(),
        ).symbol
      } catch (error) {
        Sentry.captureException(error)
        return ''
      }
    },

    setMaxClose(closeFactorPerMaxBorrow) {
      try {
        const liquidate = cTokensDetails.find(
          (value) => value.symbol === this.cMarketSymbol.toString(),
        ).liquidate
        return closeFactorPerMaxBorrow
          .minus(liquidate.sub)
          .decimalPlaces(liquidate.decimalToFix, BigNumber.ROUND_DOWN)
      } catch (error) {
        Sentry.captureException(error)
        return ''
      }
    },
    closeTemplateApprove() {
      this.waiting = false
      this.approveDialog = false
      this.$emit('approve')
    },
  },
}
</script>

<style>
.liquidate-input .v-select__selections {
  flex-wrap: inherit;
  display: contents;
}
.liquidate-input .v-select.v-text-field input {
  display: none;
}
.liquidate-input .v-select > .v-input__control > .v-input__slot {
  width: 100px;
}
</style>
