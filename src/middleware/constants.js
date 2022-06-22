import { Erc20 } from '../abis/erc20'
import { CERC20 } from '../abis/cErc20'
import { Comptroller } from '../abis/comptroller'
import { miFTM } from '../abis/miFTM'
import { CToken } from '../abis/cToken'
import { GovernorAlpha } from '../abis/governorAlpha'
import { JumpRateModelV2 } from '../abis/jumpRateModelV2'
import { Maximillion } from '../abis/maximillion'
import { PriceOracleAdapterMoc } from '../abis/priceOracleAdapterMoc'
import { PriceOracleProxy } from '../abis/priceOracleProxy'
import { FTMMocOracle } from '../abis/FTMMocOracle'
import { RLEN } from '../abis/rLEN'
import { MILens } from '../abis/MILens'
import { WhitePaperInterestRateModel } from '../abis/whitePaperInterestRateModel'
import { Multicall } from '../abis/multicall'

export const abi = {
  Erc20: Erc20,
  cErc20: CERC20,
  Comptroller: Comptroller,
  miFTM: miFTM,
  CToken: CToken,
  GovernorAlpha: GovernorAlpha,
  JumpRateModelV2: JumpRateModelV2,
  Maximillion: Maximillion,
  PriceOracleAdapterMoc: PriceOracleAdapterMoc,
  PriceOracleProxy: PriceOracleProxy,
  FTMMocOracle: FTMMocOracle,
  MILens: MILens,
  RLEN: RLEN,
  WhitePaperInterestRateModel: WhitePaperInterestRateModel,
  PriceFeed: ['function price(string symbol) returns (uint256)'],
  Multicall: Multicall,
}

export const constants = {
  Unitroller: 'Unitroller',
  PriceOracleProxy: 'PriceOracleProxy',
  Comptroller: 'Comptroller',
  MILens: 'MILens',
  miwBTC: 'miwBTC',
  miwETH: 'miwETH',
  miLINK: 'miLINK',
  miUSDT: 'miUSDT',
  miFTM: 'miFTM',
  RLEN: 'RLEN',
  MaximillionAddress: 'MaximillionAddress',
  ETHERMocOracle: 'ETHERMocOracle',
  DAIMocOracle: 'DAIMocOracle',
  USDTOracle: 'USDTOracle',
  wBTC: 'wBTC',
  wETH: 'wETH',
  LINK: 'LINK',
  USDT: 'USDT',
  Multicall: 'Multicall',
  PriceOracleAdapterMoc: 'PriceOracleAdapterMoc',
}

export const tokens = {
  250: {
    wFTM: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    wETH: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    wBTC: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    BNB: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
    USDC: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    CREAM: '0x657A1861c15A3deD9AF0B6799a195a249ebdCbc6',
    COVER: '0xB01E8419d842beebf1b70A7b5f7142abbaf7159D',
    BAND: '0x46E7628E8b4350b2716ab470eE0bA1fa9e76c6C5',
    CRV: '0x1E4F97b9f9F913c46F1632781732927B9019C68b',
    SNX: '0x56ee926bD8c72B2d5fa1aF4d9E4Cbb515a1E3Adc',
    AAVE: '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B',
    YFI: '0x29b0Da86e484E1C0029B56e817912d778aC0EC69',
    LINK: '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8',
    SUSHI: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
    DAI: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    ICE: '0xf16e81dce15B08F326220742020379B855B87DF9',
    BADGER: '0x753fbc5800a8C8e3Fb6DC6415810d627A387Dfc9',
    DIGG: '0x08f6fE8f4dC577CF81E40E03E561d29B8b33E19b',
    fUSDT: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    WOOFY: '0xD0660cD418a64a1d44E9214ad8e459324D8157f1',
    ANY: '0xdDcb3fFD12750B45d32E084887fdf1aABAb34239',
    BIFI: '0xd6070ae98b8069de6B494332d1A1a81B6179D960',
    MIM: '0x82f0B8B456c1A451378467398982d4834b6829c1',
    KEK: '0x627524d78B4fC840C887ffeC90563c7A42b671fD',
  },
  4002: {
    FTM: { address: '0xf1277d1Ed8AD466beddF92ef448A132661956621', decimals: 18 },
    wETH: { address: '0x00352e7A32dbC8CC505f04449C7B543a31D93a91', decimals: 18 },
    wBTC: { address: '0x0dCc14A34733c998eD5d1D75B036eDF5fA8fd945', decimals: 18 },
    LINK: { address: '0x4391d2f1F5775183EE17140bEdAb195Aea351930', decimals: 18 },
    // USDT: {address: '0xa37dc55c0fB743a6612e3093E4e38f8F8Cc0316F', decimals: 18},
  },
}

export const address = {
  1337: {
    Unitroller: '0xbff24b502D3E26341dA8C7885807931Fd937a9F4',
    PriceOracleProxy: '0x5C083DE2B3AEeD00bD02B6f333B1CF9387f14a8d',
    PriceOracleAdapterDai: '0xBf02A11696DFad8e43b3CAa67435f58eecE4BaEB',
    PriceOracleAdapteUSDT: '0xaF6ecF12B5704Fd33F484E96fC7a1Dd7b8D78d63',
    PriceOracleAdapterFTM: '0x7Ca2C2E270f4C528C9900B2A03F8266C9A58EA99',
    MILens: '0x99039D62a112eB0617efc02698815Bdd0E87FD07',
    miUSDT: '0x72B5fa62e6cCcAc6cE1A1d8EE889252Dd452D787',
    miDAI: '0x4C3B90305264778A7A6E0efD0fd900e4C775BC40',
    miFTM: '0xd0f5D7B2c7032dD8782B956Ba67fF578F549df61',
    RLEN: '0x0693424137E2CF9B4f799C24144970456b070aDf',
    MaximillionAddress: '0xAb1C126b200e05D9121d9747999367b7fEBE9295',
    FTMMocOracle: '0xb7a01dcF31b9BbB588d87E2C51c0d1c4151D4952',
    DAIMocOracle: '0x90825c86567A04A96B4a502D449Dab9aC2Bc2e6f',
    USDTOracle: '0x31C5787935AD7806F841c0d34D3cbe88eF313209',
    DAI: '0xb7164c5B2c669869443AD1773A7c201DbA6e243f',
    USDT: '0x7C6CBA724B6d150C62cF18A5B3e35F238E50437c',
    Multicall: '0x93f03EDbb60AbF5e870Efd491a656cde5BdC3B0A',
  },
  3: {
    Unitroller: '0x8F29B9A8725FDE226007262c8d760C29da54a439',
    PriceOracleProxy: '0xBf2c28a5247862bDEB08C357c174b7cA24FC1458',
    PriceOracleAdapterDai: '0x67bfFBB112D81e377a5f05B6710b5c5723163529',
    PriceOracleAdapteUSDT: '0x2B72557f0B67946A617906ea95e95a3f59FFF4D6',
    PriceOracleAdapterFTM: '0x63C79eA62D38B7258A536Fed18D6ab548865041C',
    MILens: '0xb116ea14754F543488AFEc2cdb566a555772A56F',
    miUSDT: '0xAF20C9501990804Db398C73e33098Fbc81a10d47',
    miDAI: '0x35b83EfbBAB12A878Db3181EaFcD6eDd94eAc103',
    miFTM: '0xbaE1e1fd1A1e9b39297bE36BF83eEB1094CB81Bd',
    RLEN: '0xc4298AA3E329622941ea23BEB93beC6c43Db55BC',
    MaximillionAddress: '0xC3C8FFe01073C709d3de069C74ECfbeB177dA4CC',
    FTMMocOracle: '0x92DE7DBeAe25b3d2Ffb428fEB4d86ba2572C2F0E',
    DAIMocOracle: '0x194Ac8D774Aef1f84B242184B0C39B00a8F507c5',
    USDTOracle: '0xF5b2cD95B0D5935d9D1ab0A0875006A29D5667e3',
    DAI: '0xdFD18BbC5c3C3c50e4B8864d85D25a300B1F3273',
    USDT: '0xD1E915C7CD0E399b961a273FF41ba756FAa6200a',
    Multicall: '0xa40AE26693C935Fb561372F130c10b97F2bC0464',
  },
  4002: {
    Unitroller: '0x7bEB5dfE4900d0c6490Bd51D52cBe1908059140c',
    PriceOracleProxy: '0x9222EDBf4e56890B063087dBaF0aFE92ACb9D768',
    PriceOracleAdapterwBTC: '0x3Ed8E2a5CdcEf5331F6F75cC3b5a31e0c93c4B8e',
    PriceOracleAdapterwETH: '0x7bB8Dd113c612f9Ba5c9610c3651aF89b1a803C7',
    PriceOracleAdapterLINK: '0xb7DA51a16ba5Fb7098F2E59Eca99Fd3EdD7DE481',
    PriceOracleAdapterUSDT: '0x7722c09C84f8496Ef83aDe8d5a0c72b91c9bd3CB',
    PriceOracleAdapterFTM: '0xB824f784e18cBca48D39954b11bb7A732A27f4e7',
    MILens: '0xAFdD6F3c4881B8575144daAb0744dE85b3E18BA5',
    miwBTC: '0xc9B30BcAbE8044f9e47b88AE5d7008CB9DFe5CD2',
    miwETH: '0xE99C28fa7ece0b0524A703f5C33F6300D1741aF8',
    miLINK: '0x66dFc99b3FbF3Bf7557c77e1291e2dBd471A7741',
    miUSDT: '0x87BEB81EDFc4aD97e6021b692BEA64b4A85521c6',
    miFTM: '0x1fd30B09c8CD23b188B880F3ACF4711cca8dd15C',
    RLEN: '0xC75530A46f1fed88c5f00c9cBCb7F5969fD5C113',
    MaximillionAddress: '0xDE87886618F9b791c1B91136C7eF97eB8BF084ae',
    wBTC: '0x0dCc14A34733c998eD5d1D75B036eDF5fA8fd945',
    wETH: '0x00352e7A32dbC8CC505f04449C7B543a31D93a91',
    LINK: '0x4391d2f1F5775183EE17140bEdAb195Aea351930',
    USDT: '0xa37dc55c0fB743a6612e3093E4e38f8F8Cc0316F',
    Multicall: '0x612e4f22828ee975FB881e6B9ccb7DF38db011d9',

    Router: '0xcCAFCf876caB8f9542d6972f87B5D62e1182767d',
    Factory: '0x5D479c2a7FB79E12Ac4eBBAeDB0322B4d5F9Fd02',
    WETH: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
  },
}

export const decimals = {
  RLEN: 18,
  FTM: 18,
  BTC: 18,
  ETH: 18,
  LINK: 18,
  USDT: 6,
  miFTM: 8,
  miwBTC: 8,
  miwETH: 8,
  miLINK: 8,
  miUSDT: 8,
}
export const percentageOfHealthToBorrow = 0.01

export const cTokensDetails = [
  {
    symbol: 'miFTM',
    name: 'Market Indicator FTM',
    decimals: decimals.miFTM,
    underlying: { symbol: 'FTM', name: 'Fantom', decimals: decimals.FTM },
    logo: 'ftm',
    adapter: 'PriceOracleAdapterFTM',
    // interestRateModel: 'WhitePaperInterestRateModel',
    //this is use to substract the calculate liquidated amount (closed Factor * borrow borrower), because this calculate have a insignificant (but precius) % of  lost
    liquidate: {
      sub: 0.000001,
      decimalToFix: 8,
    },
  },
  {
    symbol: 'miwBTC',
    name: 'Market Indicator wBTC',
    decimals: decimals.miwBTC,
    underlying: { symbol: 'wBTC', name: 'Wrapped BTC', decimals: decimals.BTC },
    logo: 'btc',
    adapter: 'PriceOracleAdapterwBTC',
    // interestRateModel: 'WhitePaperInterestRateModel',
    //this is use to substract the calculate liquidated amount (closed Factor * borrow borrower), because this calculate have a insignificant (but precius) % of  lost
    liquidate: {
      sub: 0.001,
      decimalToFix: 6,
    },
  },
  {
    symbol: 'miwETH',
    name: 'Market Indicator wETH',
    decimals: decimals.miwETH,
    underlying: { symbol: 'wETH', name: 'Wrapped Ether', decimals: decimals.ETH },
    logo: 'ether',
    adapter: 'PriceOracleAdapterwETH',
    liquidate: {
      sub: 0.001,
      decimalToFix: 6,
    },
  },
  {
    symbol: 'miLINK',
    name: 'Market Indicator LINK',
    decimals: decimals.miLINK,
    underlying: { symbol: 'LINK', name: 'Chainlink', decimals: decimals.LINK },
    logo: 'link',
    adapter: 'PriceOracleAdapterLINK',
    liquidate: {
      sub: 0.001,
      decimalToFix: 6,
    },
  },
  /*
  {
    symbol: 'miUSDT',
    name: 'Market Indicator USDT',
    decimals: decimals.miUSDT,
    underlying: { symbol: 'USDT', name: 'Tether USD', decimals: decimals.USDT },
    logo: 'usdt',
    adapter: 'PriceOracleAdapteUSDT',
    interestRateModel: 'JumpRateModelV2',
    //this is use to substract the calculate liquidated amount (closed Factor * borrow borrower), because this calculate have a insignificant (but precius) % of  lost
    liquidate: {
      sub: 0.0001,
      decimalToFix: 6,
    },
  },
  */
]

export const errorCodes = {
  comptroller: {
    codes: {
      0: { error: 'NO_ERROR', description: 'Not a failure.', hint: '' },
      1: {
        error: 'UNAUTHORIZED',
        description: 'The sender is not authorized to perform this action.',
        hint: '',
      },
      2: {
        error: 'COMPTROLLER_MISMATCH',
        description: 'Liquidation cannot be performed in markets with different comptrollers.',
        hint: '',
      },
      3: {
        error: 'INSUFFICIENT_SHORTFALL',
        description: 'The account does not have sufficient shortfall to perform this action.',
        hint: '',
      },
      4: {
        error: 'INSUFFICIENT_LIQUIDITY',
        description: 'The account does not have sufficient liquidity to perform this action.',
        hint: '',
      },
      5: { error: 'INVALID_CLOSE_FACTOR', description: 'The close factor is not valid.', hint: '' },
      6: {
        error: 'INVALID_COLLATERAL_FACTOR',
        description: 'The collateral factor is not valid.',
        hint: '',
      },
      7: {
        error: 'INVALID_LIQUIDATION_INCENTIVE',
        description: 'The liquidation incentive is invalid.',
        hint: '',
      },
      8: {
        error: 'MARKET_NOT_ENTERED',
        description: 'The market has not been entered by the account.',
        hint: '',
      },
      9: {
        error: 'MARKET_NOT_LISTED',
        description: 'The market is not currently listed by the comptroller.',
        hint: '',
      },
      10: {
        error: 'MARKET_ALREADY_LISTED',
        description: 'An admin tried to list the same market more than once.',
        hint: '',
      },
      11: { error: 'MATH_ERROR', description: 'A math calculation error occurred.', hint: '' },
      12: {
        error: 'NONZERO_BORROW_BALANCE',
        description: 'The action cannot be performed since the account carries a borrow balance.',
        hint: '',
      },
      13: {
        error: 'PRICE_ERROR',
        description: 'The comptroller could not obtain a required price of an asset.',
        hint: '',
      },
      14: {
        error: 'REJECTION',
        description: 'The comptroller rejects the action requested by the market.',
        hint: '',
      },
      15: {
        error: 'SNAPSHOT_ERROR',
        description:
          'The comptroller could not get the account borrows and exchange rate from the market.',
        hint: '',
      },
      16: {
        error: 'TOO_MANY_ASSETS',
        description: 'Attempted to enter more markets than are currently supported.',
        hint: '',
      },
      17: {
        error: 'TOO_MUCH_REPAY',
        description: 'Attempted to repay more than is allowed by the protocol.',
        hint: '',
      },
    },
    info: {
      0: { error: 'ACCEPT_ADMIN_PENDING_ADMIN_CHECK', description: '', hint: '' },
      1: { error: 'ACCEPT_PENDING_IMPLEMENTATION_ADDRESS_CHECK', description: '', hint: '' },
      2: { error: 'EXIT_MARKET_BALANCE_OWED', description: '', hint: '' },
      3: { error: 'EXIT_MARKET_REJECTION', description: '', hint: '' },
      4: { error: 'SET_CLOSE_FACTOR_OWNER_CHECK', description: '', hint: '' },
      5: { error: 'SET_CLOSE_FACTOR_VALIDATION', description: '', hint: '' },
      6: { error: 'SET_COLLATERAL_FACTOR_OWNER_CHECK', description: '', hint: '' },
      7: { error: 'SET_COLLATERAL_FACTOR_NO_EXISTS', description: '', hint: '' },
      8: { error: 'SET_COLLATERAL_FACTOR_VALIDATION', description: '', hint: '' },
      9: { error: 'SET_COLLATERAL_FACTOR_WITHOUT_PRICE', description: '', hint: '' },
      10: { error: 'SET_IMPLEMENTATION_OWNER_CHECK', description: '', hint: '' },
      11: { error: 'SET_LIQUIDATION_INCENTIVE_OWNER_CHECK', description: '', hint: '' },
      12: { error: 'SET_LIQUIDATION_INCENTIVE_VALIDATION', description: '', hint: '' },
      13: { error: 'SET_MAX_ASSETS_OWNER_CHECK', description: '', hint: '' },
      14: { error: 'SET_PENDING_ADMIN_OWNER_CHECK', description: '', hint: '' },
      15: { error: 'SET_PENDING_IMPLEMENTATION_OWNER_CHECK', description: '', hint: '' },
      16: { error: 'SET_PRICE_ORACLE_OWNER_CHECK', description: '', hint: '' },
      17: { error: 'SUPPORT_MARKET_EXISTS', description: '', hint: '' },
      18: { error: 'SUPPORT_MARKET_OWNER_CHECK', description: '', hint: '' },
    },
  },
}
