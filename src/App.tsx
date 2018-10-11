import React from 'react'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { AccountsProvider, BudgetProvider, DBProvider } from './context'
import AccountsStack from './screens/AccountsStack'
import BudgetStack from './screens/BudgetStack'
import { transitionConfig } from './utils'
import TransactionStack from './screens/TransactionStack'
const RootNavigator = createSwitchNavigator(
  {
    BudgetStack: BudgetStack,
    AccountsStack: AccountsStack,
    TransactionStack: TransactionStack,
  },
  { initialRouteName: 'TransactionStack' }
)

export default () => (
  <DBProvider>
    <AccountsProvider>
      <BudgetProvider>
        <RootNavigator />
      </BudgetProvider>
    </AccountsProvider>
  </DBProvider>
)
