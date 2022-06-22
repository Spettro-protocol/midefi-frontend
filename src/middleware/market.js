import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import FactoryContract from './factoryContract'
import { constants, decimals, abi, percentageOfHealthToBorrow } from './constants'
import * as Sentry from '@sentry/browser'

BigNumber.set({ EXPONENTIAL_AT: [-18, 36] })

/**
 * middleware that adapt events and state of rbank js to compound js
 */
export default class Market {
  // constructor() {}
  constructor(market, middleware) {
    const {
      cTokenSymbol,
      cTokenDecimals,
      tokenSymbol,
      underlyingName,
      underlyingDecimals,
      logo,
      account,
      collateralFactorMantissa,
      exchangeRateCurrent,
      reserveFactorMantissa,
      supplyRatePerBlock,
      borrowRatePerBlock,
      totalBorrows,
      totalCash,
      totalReserves,
      totalSupply,
    } = market
    this.middleware = middleware
    this.account = account
    this.factoryContract = new FactoryContract()
    this.ismiFTM = cTokenSymbol === 'miFTM'
    // set data cToken
    this.decimals = cTokenDecimals
    this.instanceAddress = this.factoryContract.addressContract[cTokenSymbol].toLowerCase()
    this.instance = this.factoryContract.getContractCtoken(cTokenSymbol)
    this.symbol = cTokenSymbol

    this.token = {}
    // validate miFTM
    if (!this.ismiFTM) {
      this.token.instance = this.factoryContract.getContractToken(tokenSymbol)
      this.token.address = this.token.instance.address.toLowerCase()
    }
    // set data token
    this.token.symbol = tokenSymbol
    this.token.name = underlyingName
    this.token.decimals = underlyingDecimals
    this.token.logo = logo

    // set borrow rate
    this.factor = 1e18
    this.blocksPerYear = 1051200

    // New information added fromt the Lens Helpers
    // Collateral factor can range from 0-90%,
    this.collateralFactorMantissa = new BigNumber(collateralFactorMantissa.toString()).div(
      this.factor,
    )
    // In the discord channel, the support team says that LTV is the same as the collateralFactor
    this.loanToValue = this.collateralFactorMantissa
    this.exchangeRateCurrent = new BigNumber(exchangeRateCurrent.toString()).div(this.factor)
    this.reserveFactorMantissa = new BigNumber(reserveFactorMantissa.toString()).div(this.factor)
    this.supplyRatePerBlock = new BigNumber(supplyRatePerBlock.toString()).div(this.factor)
    this.borrowRatePerBlock = new BigNumber(borrowRatePerBlock.toString()).div(this.factor)
    this.totalBorrows = new BigNumber(totalBorrows.toString()).div(10 ** this.token.decimals)
    this.totalCash = new BigNumber(totalCash.toString()).div(10 ** this.token.decimals)
    this.totalReserves = new BigNumber(totalReserves.toString()).div(10 ** this.token.decimals)
    this.totalSupply = new BigNumber(totalSupply.toString()).div(10 ** this.token.decimals)

    // Calculation based on the compound doc, see https://compound.finance/docs#protocol-math, search for APY
    const blocksPerDay = 4 * 60 * 24
    const daysPerYear = 365

    this.supplyApy = new BigNumber(
      (Math.pow(this.supplyRatePerBlock.toNumber() * blocksPerDay + 1, daysPerYear - 1) - 1) * 100,
    )
    this.borrowApy = new BigNumber(
      (Math.pow(this.borrowRatePerBlock.toNumber() * blocksPerDay + 1, daysPerYear - 1) - 1) * 100,
    )
    this.gasLimit = 250000
  }

  async getValueMoc() {
    // set contract
    const contract = this.factoryContract.getContract('FTMMocOracle')
    // call contract
    const [value] = await contract.callStatic.peek()
    return new BigNumber(value)
    // TODO comment validation, because in Oracle moc test fails (ok=false)
    // if (ok) {
    //   return value;
    // }
    // return 0;
  }

  async getPriceInDecimals() {
    const price = await this.getPrice()
    return new BigNumber(price).div(this.factor)
  }

  async getPrice() {
    // get price of cToken
    const priceToken = await this.getUnderlyingPrice()
    // get price of ether
    return new BigNumber(priceToken.toString()).toNumber()
  }

  async getUnderlyingPrice() {
    // set contract
    const contract = this.factoryContract.getContract('PriceOracleProxy')
    // get price of underlying
    return await contract.callStatic.getUnderlyingPrice(this.instanceAddress)
  }

  async getCurrentUserBalanceOfCtoken() {
    return this.getBalanceOfCtoken(this.account)
  }

  async getAccountBalanceOfCtoken(account) {
    // set balance of address
    const balance = await this.instance.balanceOf(account)
    // return format (without wei)
    return ethers.utils.formatUnits(balance, this.decimals)
  }

  async getTotalSupplyInUnderlying(refresh = true) {
    const totalSupply = refresh
      ? new BigNumber((await this.instance.totalSupply()).toString()).div(10 ** this.token.decimals)
      : this.totalSupply
    return totalSupply.times(this.exchangeRateCurrent)
  }

  async getUserBalanceOfUnderlying() {
    return this.getBalanceOfUnderlyingFormatted(this.account)
  }

  async getBalanceOfUnderlyingFormatted(account) {
    // set balance of account
    const balance = await this.balanceOfUnderlying(account)
    // return format (without wei)
    return ethers.utils.formatUnits(balance, this.token.decimals)
  }

  async balanceOfUnderlying(account) {
    return await this.instance.callStatic.balanceOfUnderlying(account)
  }

  async getCash() {
    // get balance of contract expressed in underlying
    const cash = await this.instance.getCash()
    return Number(cash)
  }

  async getMarketCash(refresh = true) {
    // get balance of contract expressed in underlying
    const cash = refresh
      ? new BigNumber((await this.instance.getCash()).toString()).div(10 ** this.token.decimals)
      : this.totalCash
    return cash
  }

  async getSupplyRate(refresh = true) {
    const supplyRatePerBlock = refresh
      ? new BigNumber((await this.instance.supplyRatePerBlock()).toString()).div(this.factor)
      : this.supplyRatePerBlock
    // return borrow rate
    return supplyRatePerBlock.times(100 * this.blocksPerYear).toNumber()
  }

  async getBorrowRate(refresh = true) {
    const borrowRatePerBlock = refresh
      ? new BigNumber((await this.instance.borrowRatePerBlock()).toString()).div(this.factor)
      : this.borrowRatePerBlock
    // return borrow rate
    return borrowRatePerBlock.times(100 * this.blocksPerYear).toNumber()
  }

  /**
   * Check if the user already enter the market
   * @param account
   * @returns {Promise<*>}
   */
  async checkMembership(account) {
    const contract = this.factoryContract.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )

    return contract.checkMembership(account, this.instanceAddress)
  }

  /**
   * Allow connected user to enter the market
   * @returns {Promise<*|"ok"|"not-equal"|"timed-out">}
   */
  async enterMarket() {
    // set contract
    const contract = this.factoryContract.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    // set signer
    const contractWithSigner = contract.connect(this.factoryContract.getSigner())
    // send transaction
    return contractWithSigner.enterMarkets([this.instanceAddress])
  }

  /**
   * Allow the connecte user to exit the market
   * @returns {Promise<*|"ok"|"not-equal"|"timed-out">}
   */
  async exitMarket() {
    // set contract
    const contract = this.factoryContract.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    // set signer
    const contractWithSigner = contract.connect(this.factoryContract.getSigner())
    // send transaction
    return contractWithSigner.exitMarket(this.instanceAddress)
  }

  /**
   * Supply the specified amount from this market.
   * @param {number} amount of this market's token to be supply.
   * @return {Promise<TXResult>} the wait mined transaction
   */
  async supply(amount) {
    // Required, please dont delete this
    const txOptions = {
      gasLimit: this.gasLimit,
    }
    // add decimals token
    const amountBN = this.getAmountDecimals(amount)
    // set signer
    const signerCtoken = this.instance.connect(this.factoryContract.getSigner())
    // validate miFTM
    if (!this.ismiFTM) {
      // mint token
      return signerCtoken.mint(amountBN.toString(), txOptions)
    }
    // set value
    const overrides = {
      value: amountBN.toString(),
      ...txOptions,
    }
    // mint miFTM
    return signerCtoken.mint(overrides)
  }

  /**
   * Borrows the specified amount from this market.
   * @param {number} amount of this market's token to be borrowed.
   * @param {boolean} isCallStatic about the call to contract.
   * @return {Promise<TXResult>} the wait mined transaction | the code of call static
   */
  async borrow(amount, isCallStatic = false) {
    // TODO: add validation. Account has to have entered market prior to borrowing.
    // add decimals token
    const amountBN = this.getAmountDecimals(amount)
    // connect to cerc20
    const signer = this.instance.connect(this.factoryContract.getSigner())
    //validate if call is static
    if (isCallStatic) {
      return await signer.callStatic.borrow(amountBN.toString())
    }
    // perform borrow()
    return signer.borrow(amountBN.toString())
  }

  getAmountDecimals(amount, isCtoken = false) {
    // add decimals token to fixed
    const decimalToFix = !isCtoken ? decimals[this.token.symbol] : decimals[this.symbol]
    return ethers.utils.parseUnits(
      typeof amount === 'string' ? amount : amount.toFixed(decimalToFix),
      decimalToFix,
    )
  }

  /**
   * getLiquidationIncentiveMantissa for cToken.
   * @return human number liquidationIncentiveMantissa
   */
  async getLiquidationIncentiveMantissa() {
    // set contract Comptroller delegate (Unitroller)
    const contract = this.factoryContract.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    // get incentive mantissa
    const liquidationIncentiveMantissa = await contract.liquidationIncentiveMantissa()
    // return value
    return ethers.utils.formatEther(liquidationIncentiveMantissa)
  }

  async redeemUnderlying(amount, callStatic = false) {
    // Required, please dont delete this
    const txOptions = {
      gasLimit: this.gasLimit,
    }
    // set signer token
    const signer = this.instance.connect(this.factoryContract.getSigner())
    if (callStatic) return await signer.callStatic.redeemUnderlying(amount.toString(), txOptions)
    // send redeemUnderlying
    return signer.redeemUnderlying(amount.toString(), txOptions)
  }

  withdraw(amount, callStatic = false) {
    // add decimals token
    const amountBN = this.getAmountDecimals(amount)
    // amount token
    return this.redeemUnderlying(amountBN.toString(), callStatic)
  }

  /**
   * rePays off the specified amount from an existing debt in this market.
   * May fail if there is no debt to be paid or if the user doesn't have enough
   * tokens to pay the amount entered.
   * @param {number} amount of the debt of this market's token to be paid.
   * @param {string=} from if specified executes the transaction using this account.
   * @return {Promise<TXResult>}
   */
  async payBorrow(amount) {
    let contractWithSigner
    // Required, please dont delete this
    const txOptions = {
      gasLimit: this.gasLimit,
    }
    // validate miFTM
    if (this.ismiFTM) {
      // set signer token
      contractWithSigner = this.instance.connect(this.factoryContract.getSigner())
      return contractWithSigner.repayBorrow({
        value: ethers.utils.parseEther(`${amount}`),
        ...txOptions,
      })
    }
    // set signer miFTM
    contractWithSigner = this.instance.connect(this.factoryContract.getSigner())
    return contractWithSigner.repayBorrow(ethers.utils.parseEther(`${amount}`), txOptions)
  }

  /**
   * mock events
   */
  get eventualEvents() {
    return new Promise((resolve) => {
      resolve('10')
    })
  }

  /**
   * withdrawAllowed Calls Comptroller to check if redeem is
   *   allowed for this user in this market with this amount
   * @dev to be used in withdraw modal
   * @param amount of ctoken to be redeemed for underlying
   * @param {address} account the address of the account
   * @return {response, code} response: (bool) if allowed or not, code: numerical error otherwise
   */
  async withdrawAllowed(amount, account) {
    // set
    const amountBN = this.getAmountDecimals(amount)
    // set contract Comptroller delegate (Unitroller)
    const contract = this.factoryContract.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    return contract.callStatic
      .redeemAllowed(this.instanceAddress, account, amountBN.toString())
      .then((response) => ({ allowed: response.toNumber() === 0, errorCode: response }))
  }

  /**
   * getMaxWithdrawAllowed Calculates max withdraw allowance for this account in this market
   * @dev to be used in Withdraw modal
   * @param {address} account the address of the account
   * @return {Number} res the max redeemable amount in underlying
   */
  async getMaxWithdrawAllowed(account) {
    // pseudo-code
    // if user not entered market:
    //   return min(user balance, market balance)
    // else:
    //   return min(user liquidity / (asset price * collateralFactor), market balance)
    //   this value comes from  https://github.com/riflending/rlending-protocol/blob/master/contracts/Comptroller.sol#L717
    //   we don't need the exchangeRate at this point as we want the result in the underlying and not in cTokens

    const balance = new BigNumber((await this.getUserBalanceOfUnderlying()).toString())
    const contractCash = new BigNumber((await this.getCash()) / 10 ** this.token.decimals)
    let maxWithdrawAllowed = contractCash.gt(balance) ? balance : contractCash
    const member = await this.checkMembership(account)
    if (!member) return maxWithdrawAllowed

    const { accountLiquidityInExcess } = await this.middleware.getAccountLiquidity(account)
    const liquidityInExcess = new BigNumber(accountLiquidityInExcess.toString()).div(this.factor)
    if (liquidityInExcess.lte(0)) return BigNumber(0)

    const price = new BigNumber(await this.getPrice()).div(this.factor) // current market price
    const collateralFactor = this.collateralFactorMantissa

    const tokensToDenom = collateralFactor.times(price)
    const maxAmountByLiquidityInExcess = liquidityInExcess.div(tokensToDenom)

    maxWithdrawAllowed = maxWithdrawAllowed.gt(maxAmountByLiquidityInExcess)
      ? maxAmountByLiquidityInExcess
      : maxWithdrawAllowed

    return maxWithdrawAllowed
  }

  /**
   * maxBorrowAllowedByAccount Calculates max borrow allowance for this account in this market
   * @notice this function will may only be used when entered market, otherwise liquidity will be 0
   * @dev to be used in supply, borrow and repay modals
   * @param {address} account the address of the account
   * @return {BigNumber} res the max borrowable amount
   */
  async maxBorrowAllowedByAccount(account) {
    //get price of market
    const price = await this.getUnderlyingPrice()
    console.log('price', price)
    //set price
    const priceBN = new BigNumber(price.toString()).div(this.factor)
    //get account liquidity
    const { accountLiquidityInExcess } = await this.middleware.getAccountLiquidity(account)
    //parse to decimal BN
    const accountLiquidityInExcessBN = new BigNumber(accountLiquidityInExcess.toString()).div(
      10 ** this.token.decimals,
    )
    //get cash of market
    const marketCash = await this.getMarketCash()
    const zero = new BigNumber(0)
    //get percentage of lifeguard to apply in liquidity account
    const healthguard = await this.getPorcentageOfHealtBN(accountLiquidityInExcessBN)
    //set liquidity - healthguard
    const liquidityCakculateBN = accountLiquidityInExcessBN.minus(healthguard)
    //validate price
    const accountLiquidityInUnderlying = priceBN.gt(zero) ? liquidityCakculateBN.div(priceBN) : zero
    return accountLiquidityInUnderlying.gt(marketCash) ? marketCash : accountLiquidityInUnderlying
  }

  async getPorcentageOfHealtBN(liquidityDecimalBN = 0) {
    let accountLiquidity = !liquidityDecimalBN
      ? await this.middleware.getAccountLiquidity(this.account).accountLiquidityInExcess
      : liquidityDecimalBN
    return accountLiquidity.multipliedBy(percentageOfHealthToBorrow)
  }

  /** TODO
   * Gets the equivalent of rbank getAccountValues() ¯\_(ツ)_/¯
   * @dev research DefiProt contracts to understand what this does
   * @param {address} account the address of the account
   * @return (supplyValue, borrowValue)
   */
  async getAccountValues(account) {
    const borrowValue = await this.borrowBalanceCurrent(account)
    const tokenBalance = await this.getBalanceOfUnderlyingFormatted(account)
    return tokenBalance, borrowValue
  }

  /**
   * calls borrowBalanceCurrent()
   * @dev replaces DefiProt updatedBorrowBy()
   * @param {address} account the address of the account
   * @return returns the total borrow balance including accrued interests
   */
  async borrowBalanceCurrent(account) {
    return this.instance.callStatic.borrowBalanceCurrent(account)
  }

  async borrowBalanceCurrentFormatted(account) {
    const balance = await this.borrowBalanceCurrent(account)
    return new BigNumber(ethers.utils.formatUnits(balance, this.token.decimals))
  }

  /**
   * currentExchangeRate mantissa for a given cToken.
   * @return human number currentExchangeRate
   */
  async getCurrentExchangeRate() {
    // set balance of account
    return new BigNumber(
      ethers.utils.formatUnits(await this.instance.exchangeRateStored(), this.token.decimals),
    )
  }

  async getAccountUnderwater() {
    //get borrow accounts
    const borrowAcconts = await this.borrowAccounts()
    let underWaters = []
    //get underwater accounts
    for (let index = 0; index < borrowAcconts.length; index++) {
      await this.middleware.getAccountLiquidity(borrowAcconts[index]).then((liquidity) => {
        if (new BigNumber(liquidity.accountShortfall._hex).isGreaterThan(0)) {
          underWaters.push(borrowAcconts[index])
        }
      })
    }
    return underWaters
  }

  async borrowAccounts() {
    //TODO, refact turl and provider
    let borrows = []
    if (!process.env.VUE_APP_HTTP_PROVIDER) return borrows
    const provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_HTTP_PROVIDER)
    const abiCtoken = this.ismiFTM ? abi['miFTM'] : abi['cErc20']
    const filterLocal = this.instance.filters.Borrow()
    const latest = await provider.getBlockNumber()
    const ini = 1504046
    for (let index = latest; index > ini; index -= 1000) {
      try {
        let logs = await provider.getLogs({
          ...filterLocal,
          fromBlock: index - 1000,
          toBlock: index,
        })
        if (logs.length > 0) {
          //get account of log
          let auxiliar = logs.map(function (element) {
            const iface = new ethers.utils.Interface(abiCtoken)
            //return first element of event (borrower)
            //TODO fix "args[0]"
            return iface.parseLog(element).args[0]
          })
          //get distinct address
          auxiliar = auxiliar.filter((v, i, a) => a.indexOf(v) === i)

          for (let index = 0; index < auxiliar.length; index++) {
            borrows.push(auxiliar[index])
          }
        }
      } catch (error) {
        console.error('ERROR', error)
        Sentry.captureException(error)
      }
    }
    //TODO see if apply distinct once
    //get distinct address
    borrows = borrows.filter((v, i, a) => a.indexOf(v) === i)
    return borrows
  }

  async liquidateBorrow(liquidateAccount, amount, addressCollateralMarket) {
    const amountBN = this.getAmountDecimals(amount)
    //set signer
    const signer = this.instance.connect(this.factoryContract.getSigner())
    //validate miFTM
    if (!this.ismiFTM) {
      return signer.liquidateBorrow(liquidateAccount, amountBN.toString(), addressCollateralMarket)
    }
    return signer.liquidateBorrow(liquidateAccount, addressCollateralMarket, {
      value: amountBN.toString(),
    })
  }

  /**
   * Check if the market is approve
   * @param account
   * @param amountBN => amount in BN
   * @returns bool = false need approve
   */
  async isAllowance(account, amountBN = this.getAmountDecimals(1)) {
    //validate not miFTM
    if (this.ismiFTM) return true
    // check allowance
    const allowance = await this.token.instance.allowance(account, this.instanceAddress)
    // validate if enough
    return !allowance.lt(amountBN)
  }

  async approveWithMaxUint() {
    if (!this.ismiFTM) {
      const cTokenSigner = this.token.instance.connect(this.factoryContract.getSigner())
      // approve
      return cTokenSigner.approve(this.instanceAddress, ethers.constants.MaxUint256)
    }
  }

  getTokenByExchangeRate(cTokenValue) {
    const mantissa = parseInt(this.token.decimals) - this.decimals
    const aux = new BigNumber(cTokenValue.toString()).multipliedBy(this.exchangeRateCurrent)
    return aux.div(Math.pow(10, mantissa))
  }
  getCtokenByExchangeRate(tokenValue) {
    const mantissa = parseInt(this.token.decimals) - this.decimals
    const aux = new BigNumber(tokenValue.toString()).multipliedBy(Math.pow(10, mantissa))
    return aux.div(this.exchangeRateCurrent)
  }

  async calculateSupplyRate(supplyAmount = 0, borrowAmount = 0) {
    const cash = await this.getMarketCash(true)
    const totalBorrow = this.totalBorrows
    const totalReseves = await this.instance.callStatic.totalReserves()
    const factor = this.reserveFactorMantissa.multipliedBy(this.factor).toString()
    //get interest rate model
    const rateModelContract = await this.factoryContract.getCtokenInterestModel(this.instance)
    const rateModel = rateModelContract.connect(this.factoryContract.getSigner())

    const calculateTotalSupply = cash
      .plus(supplyAmount)
      .multipliedBy(10 ** this.token.decimals)
      .toString()
    const calculateTotalBorrow = totalBorrow
      .plus(borrowAmount)
      .multipliedBy(10 ** this.token.decimals)
      .toString()
    const calculateSupplyRate = await rateModel.callStatic.getSupplyRate(
      calculateTotalSupply,
      calculateTotalBorrow,
      totalReseves.toString(),
      factor,
    )
    const calculateSupplyRateFormated = new BigNumber(calculateSupplyRate.toString()).div(
      this.factor,
    )

    return calculateSupplyRateFormated.times(100 * this.blocksPerYear).toNumber()
  }

  async calculateBorrowRate(borrowAmount = 0, supplyAmount = 0) {
    const cash = await this.getMarketCash(true)
    const totalBorrow = this.totalBorrows
    const totalReseves = await this.instance.callStatic.totalReserves()
    //get interest rate model
    const rateModelContract = await this.factoryContract.getCtokenInterestModel(this.instance)
    const rateModel = rateModelContract.connect(this.factoryContract.getSigner())

    const calculateTotalSupply = cash
      .plus(supplyAmount)
      .multipliedBy(10 ** this.token.decimals)
      .toString()
    const calculateTotalBorrow = totalBorrow
      .plus(borrowAmount)
      .multipliedBy(10 ** this.token.decimals)
      .toString()

    const calculateBorrowRate = await rateModel.callStatic.getBorrowRate(
      calculateTotalSupply,
      calculateTotalBorrow,
      totalReseves.toString(),
    )
    const calculateBorrowRateFormated = new BigNumber(calculateBorrowRate.toString()).div(
      this.factor,
    )

    return calculateBorrowRateFormated.times(100 * this.blocksPerYear).toNumber()
  }
}
