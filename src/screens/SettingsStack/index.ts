import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import SettingsScreen from './SettingsScreen'
import TransactionScreen from '../TransactionScreen'

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    Transaction: TransactionScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Settings' }
)

export default SettingsStack
