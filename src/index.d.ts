// this is important, otherwise you'll completely replace the `'react'` module
export {}

declare module 'react-navigation' {
  export function createAppContainer(any): any
}
