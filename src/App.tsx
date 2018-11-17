import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Loader } from './components'
import BudgetScreen from './screens/BudgetStack/BudgetScreen'
import BudgetTransactionsScreen from './screens/BudgetStack/BudgetTransactionsScreen'
import AccountsScreen from './screens/AccountsStack/AccountsScreen'
import AccountTransactionsScreen from './screens/AccountsStack/AccountTransactionsScreen'
import SettingsScreen from './screens/SettingsStack/SettingsScreen'
import TransactionScreen from './screens/TransactionScreen'
import { transitionConfig } from './utils'

const RootNavigator = createAppContainer(
  createStackNavigator(
    {
      Budget: BudgetScreen,
      BudgetTransactions: BudgetTransactionsScreen,
      Account: AccountsScreen,
      AccountTransactions: AccountTransactionsScreen,
      Settings: SettingsScreen,
      Transaction: TransactionScreen,
    },
    { headerMode: 'none', transitionConfig, initialRouteName: 'Budget' }
  )
)

type Props = {
  loadDB: () => void
  fetchBudgets: () => void
  fetchAccounts: () => void
  isLoadingDB: boolean
}

class App extends Component<Props, {}> {
  async componentDidMount() {
    await this.props.loadDB()
    await Promise.all([this.props.fetchBudgets(), this.props.fetchAccounts()])
  }

  render() {
    if (this.props.isLoadingDB)
      return <Loader active text="Loading database..." />
    return <RootNavigator />
  }
}

const mapState = state => ({
  isLoadingDB: state.db.isLoadingDB,
})
const mapDispatch = dispatch => {
  return {
    loadDB: dispatch.db.loadDB,
    fetchBudgets: dispatch.budget.fetchBudgets,
    fetchAccounts: dispatch.account.fetchAccounts,
  }
}

export default connect(
  mapState,
  mapDispatch
)(App)
