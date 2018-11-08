import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import BudgetScreen from './BudgetScreen'
import BudgetTransactionsScreen from './BudgetTransactionsScreen'

const BudgetStack = createStackNavigator(
  {
    Budget: BudgetScreen,
    BudgetTransactions: BudgetTransactionsScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Budget' }
)

export default BudgetStack
