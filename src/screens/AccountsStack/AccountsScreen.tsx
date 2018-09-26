import React, { Component, Fragment } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Header, Loader } from '../../components'
import MainTabs from '../MainTabs'
import { AccountsHeader } from './components'
import { withAccounts, AccountsContext } from '../../context'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {}

class AccountsScreen extends Component<Props, State> {
  render() {
    const {
      accountsContext: { isFetchingAccounts },
    } = this.props

    return (
      <Fragment>
        <Header title="Accounts" />
        <AccountsHeader />
        <View style={styles.container}>{/*  */}</View>
        <MainTabs />
        <Loader active={isFetchingAccounts} />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default withAccounts(AccountsScreen)
