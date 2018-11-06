import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import SettingsScreen from './SettingsScreen'

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Settings' }
)

export default SettingsStack
