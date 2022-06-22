import { ethers } from 'ethers'
import Vue from 'vue'
import { address, abi } from './constants'
import { NETWORK_ID } from '../config/constants'
import * as Sentry from '@sentry/browser'

export default class FactoryContract {
  constructor() {
    const chainId = +Vue?.web3Provider?.network?.chainId || NETWORK_ID
    this.addressContract = address[chainId]
    this.provider = !process.env.VUE_APP_HTTP_PROVIDER
      ? Vue.web3Provider
      : new ethers.providers.JsonRpcProvider(process.env.VUE_APP_HTTP_PROVIDER)
  }

  getSigner() {
    const format = Vue.web3Provider.formatter.formats
    const signer = Vue.web3Provider.getSigner()
    // assign format to signer
    Object.assign(signer.provider.formatter, { format })
    return signer
  }

  createContract(address, abi, provider) {
    if (!address || !abi || !provider) {
      Sentry.captureException(new Error(`createContract failed with address:`, address, `abi`, abi))
    }
    console.log('create contract at ', address)
    // console.trace();
    return new ethers.Contract(address, abi, provider)
  }

  validateContractName(name) {
    if (!Object.prototype.hasOwnProperty.call(this.addressContract, name)) {
      console.error(`contract name (${name}) not exist in constants`)
      // console.trace();
      return false
    }
    return true
  }
  getContractAddress(name) {
    if (this.validateContractName(name)) {
      return this.addressContract[name]
    }
  }

  getContract(name) {
    if (this.validateContractName(name)) {
      return this.createContract(this.addressContract[name], abi[name], this.provider)
    }
  }

  getContractToken(name) {
    console.log('getContractToken ', name)
    if (this.validateContractName(name)) {
      return this.createContract(this.addressContract[name], abi.Erc20, this.provider)
    }
  }

  getContractCtoken(name) {
    if (this.validateContractName(name)) {
      const abiCtoken = name == 'miFTM' ? abi.miFTM : abi.cErc20
      return this.createContract(this.addressContract[name], abiCtoken, this.provider)
    }
  }

  getContractByNameAndAbiName(nameContract, nameAbi) {
    if (
      this.validateContractName(nameContract) &&
      Object.prototype.hasOwnProperty.call(abi, nameAbi)
    ) {
      return this.createContract(this.addressContract[nameContract], abi[nameAbi], this.provider)
    }
  }

  async getCtokenInterestModel(ctoken) {
    const modelAddress = await ctoken.interestRateModel()
    return this.createContract(modelAddress, abi['JumpRateModelV2'], this.provider)
  }
}
