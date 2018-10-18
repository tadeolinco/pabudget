import 'intl'
import 'intl/locale-data/jsonp/en-PH'

const currencyFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

const toCurrency = (money: number): string => {
  return currencyFormat
    .format(money)
    .replace(/₱\s*/, 'P')
    .replace(/PHP\s*/, 'P')
}

export default toCurrency
