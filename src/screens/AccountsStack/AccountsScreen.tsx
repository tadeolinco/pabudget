import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Header, Loader } from '../../components'
import MainTabs from '../MainTabs'
import { AccountsHeader } from './components'
import { withAccounts, AccountsContext } from '../../context'
import AccountItem from './components/AccountItem'
import { FONT_SIZES } from '../../utils'
import Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {}

class AccountsScreen extends Component<Props, State> {
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  render() {
    const { accountsContext } = this.props
    const { isFetchingAccounts, accounts, amountPerAccount } = accountsContext
    return (
      <Fragment>
        <Header
          title="Accounts"
          right={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('NewAccount')
              }}
              style={{ padding: 10 }}
            >
              <Icon name="plus" color="white" size={FONT_SIZES.LARGE} />
            </TouchableOpacity>
          }
        />
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
        <Loader active={isFetchingAccounts} text="Getting your accounts..." />
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
