import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import BudgetScreen from './BudgetScreen'

const BudgetStack = createStackNavigator(
  {
    Budget: BudgetScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Budget' }
)

export default BudgetStack
