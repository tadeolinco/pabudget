import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import AccountsScreen from './AccountsScreen'
import AccountTransactionsScreen from './AccountTransactionsScreen'

const AccountsStack = createStackNavigator(
  {
    Accounts: AccountsScreen,
    AccountTransactions: AccountTransactionsScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Accounts' }
)

export default AccountsStack
