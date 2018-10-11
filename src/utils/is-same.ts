const isSame = (a: any, b: any): boolean =>
  JSON.stringify(a) === JSON.stringify(b)

export default isSame
