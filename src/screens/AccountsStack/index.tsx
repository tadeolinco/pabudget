import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import AccountsScreen from './AccountsScreen'
import NewAccountScreen from './NewAccountScreen'

const AccountsStack = createStackNavigator(
  {
    Accounts: AccountsScreen,
    NewAccount: NewAccountScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Accounts' }
)

export default AccountsStack
