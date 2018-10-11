import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import AccountsScreen from './AccountsScreen'
import NewAccountScreen from './NewAccountScreen'
import AccountDetailsScreen from './AccountDetailsScreen'

const AccountsStack = createStackNavigator(
  {
    Accounts: AccountsScreen,
    NewAccount: NewAccountScreen,
    AccountDetails: AccountDetailsScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Accounts' }
)

export default AccountsStack
