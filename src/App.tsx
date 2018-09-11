import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import { BudgetProvider, DBProvider } from './context'
import BudgetScreen from './screens/BudgetScreen'

const RootNavigator = createSwitchNavigator({
  Budget: {
    screen: BudgetScreen,
  },
})

export default () => (
  <DBProvider>
    <BudgetProvider>
      <RootNavigator />
    </BudgetProvider>
  </DBProvider>
)
