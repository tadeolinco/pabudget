import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import TransactionScreen from './TransactionScreen'

const TransactionStack = createStackNavigator(
  {
    Transaction: TransactionScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Transaction' }
)

export default TransactionStack
