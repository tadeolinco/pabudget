import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import ArrangeBudgetScreen from './ArrangeBudgetScreen'
import BudgetScreen from './BudgetScreen'
import NewBudgetScreen from './NewBudgetScreen'
import UpdateBudgetScreen from './UpdateBudgetScreen'

const BudgetStack = createStackNavigator(
  {
    Budget: BudgetScreen,
    ArrangeBudget: ArrangeBudgetScreen,
    NewBudget: NewBudgetScreen,
    UpdateBudget: UpdateBudgetScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Budget' }
)

export default BudgetStack
