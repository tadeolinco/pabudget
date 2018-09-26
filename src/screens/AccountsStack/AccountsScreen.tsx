import React, { Component, Fragment } from 'react'
import { StyleSheet, View, ScrollView, FlatList } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Header, Loader } from '../../components'
import MainTabs from '../MainTabs'
import { AccountsHeader } from './components'
import { withAccounts, AccountsContext } from '../../context'
import AccountItem from './components/AccountItem'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {}

class AccountsScreen extends Component<Props, State> {
  render() {
    const { accountsContext } = this.props
    const { isFetchingAccounts, accounts, amountPerAccount } = accountsContext
    console.log(amountPerAccount)
    return (
      <Fragment>
        <Header title="Accounts" />
        <AccountsHeader />
        <ScrollView style={styles.container}>
          <FlatList
            keyExtractor={account => String(account.id)}
            data={accounts}
            extraData={accountsContext}
            renderItem={({ item: account }) => (
              <AccountItem
                key={account.id}
                account={account}
                totalAmount={amountPerAccount.get(account.id)}
              />
            )}
          />
        </ScrollView>
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
