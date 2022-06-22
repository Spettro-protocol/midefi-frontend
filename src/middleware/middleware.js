import { ethers } from 'ethers'
import Vue from 'vue'
import BigNumber from 'bignumber.js'
import Market from './market'
import FactoryContract from './factoryContract'
import { constants, address, errorCodes, cTokensDetails, tokens, abi } from './constants'
import { NETWORK_ID } from '../config/constants'

BigNumber.set({ EXPONENTIAL_AT: [-18, 36] })

export default class Middleware {
  constructor() {
    this.factoryContractInstance = new FactoryContract()
    this.factor = 10 ** 18
  }

  async getAmountsOut(amountIn, tokenInAddress, tokenOutAddress) {
    const abi = ['function getAmountsOut(uint, address[]) returns (uint[])']
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    const amount1 = await contract.callStatic.getAmountsOut(
      amountIn,
      await this.getPath(tokenInAddress, tokenOutAddress),
    )
    return amount1.at(-1)
  }

  async getAmountsIn(amountOut, tokenInAddress, tokenOutAddress) {
    const abi = ['function getAmountsIn(uint, address[]) returns (uint[])']
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    const amount1 = await contract.callStatic.getAmountsIn(
      amountOut,
      await this.getPath(tokenInAddress, tokenOutAddress),
    )
    return amount1[0]
  }

  async getPath(tokenInAddress, tokenOutAddress) {
    const abi = ['function getPair(address, address) returns (address)']
    const contract = new ethers.Contract(this.getAddresses().Factory, abi, Vue.web3Provider)
    const pair = await contract.callStatic.getPair(tokenInAddress, tokenOutAddress)
    if (pair != '0x0000000000000000000000000000000000000000')
      return [tokenInAddress, tokenOutAddress]
    return [tokenInAddress, this.getAddresses().WETH, tokenOutAddress]
  }

  async swapExactTokensForTokens(amountIn, tokenInAddress, tokenOutAddress, account) {
    const abi = [
      'function swapExactTokensForTokens(uint, uint, address[], address, uint) returns (uint[])',
    ]
    const path = await this.getPath(tokenInAddress, tokenOutAddress)
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    await contract
      .connect(Vue.web3Provider.getSigner())
      .swapExactTokensForTokens(amountIn, 0, path, account, +new Date() + 300000)
  }
  async swapExactETHForTokens(amountIn, tokenOutAddress, account) {
    const abi = [
      'function swapExactETHForTokens(uint, address[], address, uint) payable returns (uint[])',
    ]
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    await contract
      .connect(Vue.web3Provider.getSigner())
      .swapExactETHForTokens(
        0,
        [this.getAddresses().WETH, tokenOutAddress],
        account,
        +new Date() + 300000,
        { value: amountIn },
      )
  }
  async swapExactTokensForETH(amountIn, tokenInAddress, account) {
    const abi = [
      'function swapExactTokensForETH(uint, uint, address[], address, uint) returns (uint[])',
    ]
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    await contract
      .connect(Vue.web3Provider.getSigner())
      .swapExactTokensForETH(
        amountIn,
        0,
        [tokenInAddress, this.getAddresses().WETH],
        account,
        +new Date() + 300000,
      )
  }
  async swapTokensForExactTokens(amountOut, tokenInAddress, tokenOutAddress, account) {
    const abi = [
      'function swapTokensForExactTokens(uint, uint, address[], address, uint) returns (uint[])',
    ]
    const path = await this.getPath(tokenInAddress, tokenOutAddress)
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    await contract
      .connect(Vue.web3Provider.getSigner())
      .swapTokensForExactTokens(
        amountOut,
        ethers.constants.MaxUint256,
        path,
        account,
        +new Date() + 300000,
      )
  }
  async swapTokensForExactETH(amountOut, tokenInAddress, account) {
    const abi = [
      'function swapTokensForExactETH(uint, uint, address[], address, uint) returns (uint[])',
    ]
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    await contract
      .connect(Vue.web3Provider.getSigner())
      .swapTokensForExactETH(
        amountOut,
        ethers.constants.MaxUint256,
        [tokenInAddress, this.getAddresses().WETH],
        account,
        +new Date() + 300000,
      )
  }
  async swapETHForExactTokens(amountIn, amountOut, tokenOutAddress, account) {
    const abi = [
      'function swapETHForExactTokens(uint, address[], address, uint) payable returns (uint[])',
    ]
    const contract = new ethers.Contract(this.getAddresses().Router, abi, Vue.web3Provider)
    await contract
      .connect(Vue.web3Provider.getSigner())
      .swapETHForExactTokens(
        amountOut,
        [this.getAddresses().WETH, tokenOutAddress],
        account,
        +new Date() + 300000,
        { value: amountIn },
      )
  }

  /**
   * Check if the token is approve
   * @param account
   * @param marketSymbol
   * @returns bool = false need approve
   */
  async allowanceToken(account, token) {
    //validate symbol
    if (token === 'FTM') return true
    const addresses = this.getTokens()
    if (addresses[token] == null) return false
    //set contract
    const contract = new ethers.Contract(addresses[token].address, abi.Erc20, Vue.web3Provider)
    //set amount
    const amountBN = ethers.utils.parseUnits('1', await contract.callStatic.decimals())
    // check allowance
    const allowance = await contract.callStatic.allowance(account, this.getAddresses().Router)
    // validate if enough
    return !allowance.lt(amountBN)
  }

  async approveTokenWithMaxUint(token) {
    if (token === 'FTM') return
    const addresses = this.getTokens()
    if (addresses[token] == null) return false
    //set contract
    const contract = new ethers.Contract(addresses[token].address, abi.Erc20, Vue.web3Provider)
    // approve
    return await contract
      .connect(Vue.web3Provider.getSigner())
      .approve(this.getAddresses().Router, ethers.constants.MaxUint256)
  }

  getTokens() {
    const chainId = +Vue?.web3Provider?.network?.chainId || NETWORK_ID
    return tokens[chainId]
  }
  getAddresses() {
    const chainId = +Vue?.web3Provider?.network?.chainId || NETWORK_ID
    return address[chainId]
  }

  async getMarkets(account) {
    console.log('getMarkets')
    const markets = []
    const addresses = this.getAddresses()
    console.log('get addresses')
    console.log('cTokensDetails', cTokensDetails)
    for (let cTokensDetail of cTokensDetails) {
      const {
        collateralFactorMantissa,
        exchangeRateCurrent,
        reserveFactorMantissa,
        supplyRatePerBlock,
        borrowRatePerBlock,
        totalBorrows,
        totalCash,
        totalReserves,
        totalSupply,
      } = await this.getCTokenMetadata(addresses[cTokensDetail.symbol])
      const options = {
        cTokenSymbol: cTokensDetail.symbol,
        cTokenDecimals: cTokensDetail.decimals,
        tokenSymbol: cTokensDetail.underlying.symbol,
        underlyingName: cTokensDetail.underlying.name,
        underlyingDecimals: cTokensDetail.underlying.decimals,
        logo: cTokensDetail.logo,
        collateralFactorMantissa,
        exchangeRateCurrent,
        reserveFactorMantissa,
        supplyRatePerBlock,
        borrowRatePerBlock,
        totalBorrows,
        totalCash,
        totalReserves,
        totalSupply,
        account,
      }
      console.log('pushed ', cTokensDetail)
      markets.push(new Market(options, this))
    }
    return markets
  }

  async getCTokenMetadata(cTokenAddress) {
    const contract = this.factoryContractInstance.getContract(constants.MILens)
    console.log('get contract')
    return contract.callStatic.cTokenMetadata(cTokenAddress)
  }

  async cTokenBalancesAll(cTokensList, account) {
    const contract = this.factoryContractInstance.getContract(constants.MILens)
    return contract.callStatic.cTokenBalancesAll(cTokensList, account)
  }

  /**
   * getAccountLiquidity gets account liquidity information
   * @dev This only works for accounts that have entered a borrow market, othewise returns (0,0,0)
   * @param account Address of the account to snapshot
   * @return (possible error code (semi-opaque),
   *          account liquidity in excess of collateral requirements,
   *          account shortfall below collateral requirements)
   */
  async getAccountLiquidity(account) {
    const contract = this.factoryContractInstance.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    const [err, accountLiquidityInExcess, accountShortfall] = await contract.getAccountLiquidity(
      account,
    )
    return {
      err,
      accountLiquidityInExcess,
      accountShortfall,
    }
  }

  async getWalletAccountBalance(account, tokenAddress, decimals) {
    const abi = ['function balanceOf(address) returns (uint)']
    console.log(`getting balance from ${tokenAddress}`)
    const contract = new ethers.Contract(tokenAddress, abi, Vue.provider)
    console.log('contract', contract)
    const balance = await contract.callStatic.balanceOf(account)
    console.log('balance raw', balance)
    console.log('decimals', decimals)
    return balance / 10 ** decimals
  }

  async getWalletAccountBalanceForEther(account) {
    const balance = await Vue.web3Provider.getBalance(account)
    return ethers.utils.formatEther(balance)
  }

  async getAllMarketsTotals(account) {
    const markets = await this.getMarkets(account)
    const marketsIn = (await this.getAssetsIn(account)).map((addr) => addr.toLowerCase())
    const multicallContract = this.factoryContractInstance.getContract(constants.Multicall)
    const priceOracleProxyContract = this.factoryContractInstance.getContract(
      constants.PriceOracleProxy,
    )
    const cTokenContract = this.factoryContractInstance.getContract(constants.miFTM)

    let callArguments = []
    for (let i = 0; i < markets.length; i++) {
      callArguments.push({
        target: priceOracleProxyContract.address,
        callData: priceOracleProxyContract.interface.encodeFunctionData('getUnderlyingPrice', [
          markets[i].instanceAddress,
        ]),
      })
      callArguments.push({
        target: markets[i].instanceAddress,
        callData: cTokenContract.interface.encodeFunctionData('getAccountSnapshot', [account]),
      })
    }

    const results = await multicallContract.callStatic.aggregate(callArguments)

    let marketsTotals = []
    for (var i = 0; i < markets.length; i++) {
      const underlyingPrice = priceOracleProxyContract.interface.decodeFunctionResult(
        'getUnderlyingPrice',
        results.returnData[i * 2],
      )
      const underlyingPriceBN = new BigNumber(underlyingPrice.toString()).div(this.factor)

      const [err, cTokenBalance, borrowBalance, exchangeRateMantissa] =
        cTokenContract.interface.decodeFunctionResult(
          'getAccountSnapshot',
          results.returnData[i * 2 + 1],
        )
      const cTokenBalanceBN =
        Number(err) === 0 ? new BigNumber(cTokenBalance.toString()) : new BigNumber(0)
      const borrowBalanceBN =
        Number(err) === 0
          ? new BigNumber(borrowBalance.toString()).div(10 ** markets[i].token.decimals)
          : new BigNumber(0)
      const exchangeRateBN =
        Number(err) === 0
          ? new BigNumber(exchangeRateMantissa.toString()).div(this.factor)
          : new BigNumber(1)

      const underlyingBalanceBN = cTokenBalanceBN
        .times(exchangeRateBN)
        .div(10 ** markets[i].token.decimals)
      const collateralFactorBN = markets[i].collateralFactorMantissa

      marketsTotals.push({
        address: markets[i].instanceAddress,
        isInMarket: marketsIn.includes(markets[i].instanceAddress),
        collateralFactorMantissa: collateralFactorBN,
        symbol: markets[i].symbol,
        decimals: markets[i].decimals,
        cTokenBalance: cTokenBalanceBN.div(10 ** markets[i].decimals),
        exchangeRateMantissa: exchangeRateBN,
        underlyingPrice: underlyingPriceBN,
        underlyingBalance: underlyingBalanceBN,
        supplyValueUsd: underlyingBalanceBN.times(underlyingPriceBN),
        borrowValueUsd: borrowBalanceBN.times(underlyingPriceBN),
      })
    }
    return marketsTotals
  }

  async getTotalSupplysAndBorrows(account) {
    const marketsTotals = await this.getAllMarketsTotals(account)
    const total = marketsTotals.reduce(
      (accumulator, currentValue) => ({
        supplyValue: accumulator.supplyValue.plus(currentValue.supplyValueUsd),
        supplyValueAsCollateral: currentValue.isInMarket
          ? accumulator.supplyValueAsCollateral.plus(currentValue.supplyValueUsd)
          : accumulator.supplyValueAsCollateral,
        borrowValue: accumulator.borrowValue.plus(currentValue.borrowValueUsd),
      }),
      {
        supplyValue: new BigNumber(0),
        supplyValueAsCollateral: new BigNumber(0),
        borrowValue: new BigNumber(0),
      },
    )
    return total
  }

  getMsjErrorCodeComptroller(errorNumber, isErroInfo = false) {
    const retorno = errorCodes.comptroller[isErroInfo ? 'info' : 'codes'][Number(errorNumber)]
    return !retorno ? '' : retorno.description
  }

  // calls comptroller to retrieve the liquidationFactor
  async getLiquidationFactor() {
    let contract = this.factoryContractInstance.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    const liqFactor = await contract.closeFactorMantissa()
    return liqFactor
  }

  /**
   * getAccountHealth calculates the account health factor
   * @dev returns percentage value between 0 and 1
   * @param account Address of the account to snapshot
   * @return 1 - (SUM_market borrowValue / SUM_market(supplyValue * colFact) )
   */
  async getAccountHealth(account) {
    const marketsTotals = await this.getAllMarketsTotals(account)
    const inMarketsTotals = marketsTotals.filter((market) => market.isInMarket)
    const total = inMarketsTotals.reduce(
      (accumulator, currentValue) => ({
        supplyByFactor: accumulator.supplyByFactor.plus(
          currentValue.supplyValueUsd.times(currentValue.collateralFactorMantissa),
        ),
        borrowValue: accumulator.borrowValue.plus(currentValue.borrowValueUsd),
      }),
      { supplyByFactor: new BigNumber(0), borrowValue: new BigNumber(0) },
    )
    return total.supplyByFactor.eq(0) || total.borrowValue.eq(0)
      ? 1
      : new BigNumber(1).minus(total.borrowValue.div(total.supplyByFactor)).toNumber()
  }

  async getAssetsIn(account) {
    const contract = this.factoryContractInstance.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    return contract.getAssetsIn(account)
  }

  async getAssetsBalanceIn(account) {
    const assets = await this.getAssetsIn(account)
    let balances = []
    const markets = await this.getMarkets(account)
    for (let asset of assets) {
      let market = markets.find(
        (market) => market.instanceAddress.toLowerCase() === asset.toLowerCase(),
      )
      if (market) {
        balances.push({
          symbol: market.token.symbol,
          balance: await market.getBalanceOfUnderlyingFormatted(account),
          marketAddress: market.instanceAddress,
          price: await market.getPriceInDecimals(),
        })
      }
    }
    return balances
  }

  async liquidateBorrowAllowed(
    liquidateAccountAddress,
    liquidatorAccountAddress,
    amount,
    addressLiquidateMarket,
    addressCollateralMarket,
  ) {
    //parse amount
    const decimal = 18
    let amountBN = ethers.utils.parseUnits(amount.toFixed(decimal), decimal)
    //get contract and signer
    const contract = this.factoryContractInstance.getContractByNameAndAbiName(
      constants.Unitroller,
      constants.Comptroller,
    )
    const signer = contract.connect(this.factoryContractInstance.getSigner())
    //call liquidateBorrowAllowed
    return await signer.callStatic.liquidateBorrowAllowed(
      addressLiquidateMarket,
      addressCollateralMarket,
      liquidatorAccountAddress,
      liquidateAccountAddress,
      amountBN.toString(),
    )
  }

  /**
   * getEtherPrice query the oracle to get ether price
   * @return BigNumber value of the ether price expressed in usd
   */
  async getEtherPrice() {
    const contract = this.factoryContractInstance.getContract('FTMMocOracle')
    const [value] = await contract.callStatic.peek()
    return new BigNumber(value)
  }

  async getAdapterPrice(adapterName) {
    console.log('getAdapterPrice', adapterName)
    const contract = this.factoryContractInstance.getContractByNameAndAbiName(
      adapterName,
      constants.PriceOracleAdapterMoc,
    )
    if (!contract) return
    const value = await contract.callStatic.assetPrices(this.getAddresses()[adapterName])
    return new BigNumber(value.toString()).div(10 ** 18)
  }

  /**
   * Check if some market was entered
   * @param account
   * @returns {Promise<boolean>}
   */
  async hasEnteredToSomeMarket(account) {
    const markets = await this.getMarkets(account)
    const marketsMemberships = await Promise.all(
      markets.map((market) => market.checkMembership(account)),
    )
    return marketsMemberships.some((value) => value)
  }

  /**
   * Check if the market is approve
   * @param account
   * @param marketSymbol
   * @returns bool = false need approve
   */
  async isAccountAllowanceInMarket(account, marketSymbol) {
    //validate symbol
    const symbol = constants[marketSymbol]
    const cTokenDetail = cTokensDetails.find((element) => element.underlying.symbol == symbol)
    if (!cTokenDetail || !symbol) return false
    //validate not miFTM
    if (symbol === constants['FTM']) return true
    const addresses = this.getAddresses()
    //set amount
    const amountBN = ethers.utils.parseUnits('1', cTokenDetail.underlying.decimals)
    //set contract
    const contract = this.factoryContractInstance.getContractToken(symbol)
    // check allowance
    const allowance = await contract.allowance(account, addresses[cTokenDetail.symbol])
    // validate if enough
    return !allowance.lt(amountBN)
  }

  async approveMarketWithMaxUint(marketSymbol) {
    //validate symbol
    const symbol = constants[marketSymbol]
    const cTokenDetail = cTokensDetails.find((element) => element.underlying.symbol == symbol)
    if (!cTokenDetail || !symbol) return
    //validate not Ether
    if (symbol === constants['FTM']) return
    const addresses = this.getAddresses()
    //set contract
    const contract = this.factoryContractInstance.getContractToken(symbol)
    //set signer
    const cTokenSigner = contract.connect(this.factoryContractInstance.getSigner())
    // approve
    return cTokenSigner.approve(addresses[cTokenDetail.symbol], ethers.constants.MaxUint256)
  }

  async getGasPrice() {
    return Vue.web3Provider.getGasPrice().then((price) => {
      return new BigNumber(price.toString()).div(this.factor)
    })
  }
}
