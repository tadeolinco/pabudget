const currenyFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

const toCurrency = (money: number): string => {
  return currenyFormat.format(money).replace(/PHP\s/, 'P')
}

export default toCurrency
