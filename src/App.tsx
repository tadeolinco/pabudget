import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import { AccountsProvider, BudgetProvider, DBProvider } from './context'
import AccountsStack from './screens/AccountsStack'
import BudgetStack from './screens/BudgetStack'
import TransactionStack from './screens/TransactionStack'
import SettingsStack from './screens/SettingsStack'

const RootNavigator = createSwitchNavigator(
  {
    BudgetStack: BudgetStack,
    AccountsStack: AccountsStack,
    TransactionStack: TransactionStack,
    SettingsStack: SettingsStack,
  },
  { initialRouteName: 'BudgetStack' }
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
