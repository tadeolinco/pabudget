import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import AccountsScreen from './AccountsScreen'

const AccountsStack = createStackNavigator(
  {
    Accounts: AccountsScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Accounts' }
)

export default AccountsStack
