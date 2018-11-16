import { createStackNavigator } from 'react-navigation'
import { transitionConfig } from '../../utils'
import BudgetScreen from './BudgetScreen'
import BudgetTransactionsScreen from './BudgetTransactionsScreen'
import TransactionScreen from '../TransactionScreen'

const BudgetStack = createStackNavigator(
  {
    Budget: BudgetScreen,
    BudgetTransactions: BudgetTransactionsScreen,
    Transaction: TransactionScreen,
  },
  { headerMode: 'none', transitionConfig, initialRouteName: 'Budget' }
)

export default BudgetStack
