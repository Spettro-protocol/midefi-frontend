import Vue from 'vue'
import { Decimal } from 'decimal.js-light'

Vue.filter('formatPrice', (value, decimals = 2) => {
  const castedValue = value.isBigNumber ? value : Number(value)
  const val = castedValue.toFixed(decimals).replace(',', '.')
  decimals++
  const regexString = '\\B(?=(\\d{' + decimals + '})+(?!\\d))'
  const regex = new RegExp(regexString)
  return `$ ${val.toString().replace(regex, ',')}`
})

function toSD(value, digits = 6) {
  const castedValue = value.isBigNumber ? value : Number(value)
  Decimal.set({ rounding: Decimal.ROUND_UP, toExpNeg: -18, toExpPos: 36 })
  return new Decimal(castedValue.toFixed(digits)).toSignificantDigits(digits)
}

Vue.filter('formatToken', (value, decimals, digits = 6) => {
  const val = (value / 10 ** decimals).toFixed(decimals)
  return toSD(val, digits)
})

Vue.filter('formatNumber', toSD)

Vue.filter('formatPercentage', (value) => {
  const castedValue = value.isBigNumber ? value : Number(value)
  return `${castedValue.toFixed(2)} %`
})

function hashCutOff(hash) {
  return `${hash.substring(0, 4)}...${hash.substring(hash.length - 4, hash.length)}`
}
Vue.filter('formatHash', hashCutOff)
