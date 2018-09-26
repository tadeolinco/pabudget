import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import { AccountsProvider, BudgetProvider, DBProvider } from './context'
import AccountsStack from './screens/AccountsStack'
import BudgetStack from './screens/BudgetStack'

const RootNavigator = createSwitchNavigator(
  {
    BudgetStack: BudgetStack,
    AccountsStack: AccountsStack,
  },
  { initialRouteName: 'AccountsStack' }
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
