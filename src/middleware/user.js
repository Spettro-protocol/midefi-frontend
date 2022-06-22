import { NETWORK_ID } from '../config/constants'
import Vue from 'vue'
import * as Sentry from '@sentry/browser'

export default class User {
  constructor() {
    const chainId = +Vue?.web3Provider?.network?.chainId || NETWORK_ID
    this.prefixKey = chainId.toString().concat('rLendingA')
  }

  createTx(hash, type, price, date = Date.now(), status) {
    return { hash: hash, type: type, date: date, price: price, status: status }
  }

  getKeyLocalStorage(account) {
    if (!account) return
    return this.prefixKey + account
  }

  validateExistLocalStorage(account) {
    const keyLS = this.getKeyLocalStorage(account)
    if (localStorage.getItem(keyLS)) {
      try {
        return JSON.parse(localStorage.getItem(keyLS))
      } catch (e) {
        localStorage.removeItem(keyLS)
        Sentry.captureException(e)
      }
    }
  }
  getDataLocalStorage(account) {
    return this.validateExistLocalStorage(account)
  }

  _persistLocalStorage(account, data) {
    const keyLS = this.getKeyLocalStorage(account)
    const parsed = JSON.stringify(data)
    // localStorage.account = this.accountStorage
    localStorage.setItem(keyLS, parsed)
  }

  addTxToAccountList(tx, account) {
    let txList = this.getDataLocalStorage(account) ?? []
    if (!tx) {
      return false
    }
    txList.push(tx)
    this._persistLocalStorage(account, txList)
    return true
  }
}
