import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import ArrangeBudgetScreen from './ArrangeBudgetScreen'
import BudgetScreen from './BudgetScreen'
import NewBudgetScreen from './NewBudgetScreen'

const BudgetStack = createStackNavigator(
  {
    Budget: BudgetScreen,
    ArrangeBudget: ArrangeBudgetScreen,
    NewBudget: NewBudgetScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Budget' }
)

export default BudgetStack
