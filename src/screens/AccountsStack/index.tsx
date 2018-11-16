import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import AccountsScreen from './AccountsScreen'
import AccountTransactionsScreen from './AccountTransactionsScreen'
import TransactionScreen from '../TransactionScreen'

const AccountsStack = createStackNavigator(
  {
    Accounts: AccountsScreen,
    AccountTransactions: AccountTransactionsScreen,
    Transaction: TransactionScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Accounts' }
)

export default AccountsStack
