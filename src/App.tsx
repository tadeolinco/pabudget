import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import { BudgetProvider, DBProvider } from './context'
import BudgetScreen from './screens/BudgetScreen'

const RootNavigator = createBottomTabNavigator({
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
