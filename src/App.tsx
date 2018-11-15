import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createSwitchNavigator } from 'react-navigation'
import AccountsStack from './screens/AccountsStack'
import BudgetStack from './screens/BudgetStack'
import TransactionStack from './screens/TransactionStack'
import SettingsStack from './screens/SettingsStack'
import { Loader } from './components'

const RootNavigator = createSwitchNavigator(
  {
    BudgetStack: BudgetStack,
    AccountsStack: AccountsStack,
    TransactionStack: TransactionStack,
    SettingsStack: SettingsStack,
  },
  { initialRouteName: 'BudgetStack' }
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
    await Promise.all([
      this.props.fetchBudgets(),
      //  this.props.fetchAccounts
    ])
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
    // fetchAccounts: dispatch.account.fetchAccounts,
  }
}

export default connect(
  mapState,
  mapDispatch
)(App)
