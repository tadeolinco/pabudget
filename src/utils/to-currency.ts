const toCurrency = (money: string | number): string => {
  if (isNaN(+money)) return 'NaN'
  if (money === '') return 'P0'

  const prefix = money < 0 ? '-P' : 'P'

  let moneyString = money.toString().split('.')[0]

  if (money < 0) moneyString = moneyString.slice(1)

  const value = moneyString.replace(/(\d)(?=(\d{3})+$)/g, '$1,')

  return prefix + value
}

export default toCurrency
