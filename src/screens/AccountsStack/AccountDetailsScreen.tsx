import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Header, Tabs } from '../../components'
import { FONT_SIZES, COLORS, toCurrency } from '../../utils'
import { Account } from '../../entities'
import { withAccounts, AccountsContext } from '../../context'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {
  account: Account
}

class AccountDetailsScreen extends Component<Props, State> {
  state: State = {
    account: null,
  }

  componentDidMount() {
    const accountId = this.props.navigation.getParam('accountId')
    const account = this.props.accountsContext.accounts.find(
      account => account.id === accountId
    )

    this.setState({ account })
  }

  renderTransaction = ({ item }) => {
    return null
  }

  render() {
    if (this.state.account === null) return null

    const tabItems = [
      { text: 'Update', icon: 'edit', onPress: () => {} },
      { text: 'Delete', icon: 'trash-alt', onPress: () => {} },
    ]

    const totalAmount = this.props.accountsContext.amountPerAccount.get(
      this.state.account.id
    )

    return (
      <Fragment>
        <Header title={`${this.state.account.name} Account`} hasBack />
        <ScrollView style={styles.container}>
          <View
            style={[
              styles.headerTextContainer,
              {
                backgroundColor:
                  totalAmount === 0
                    ? COLORS.GRAY
                    : totalAmount > 0
                      ? COLORS.GREEN
                      : COLORS.RED,
              },
            ]}
          >
            <Text style={styles.headerText}>
              Current Amount{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {toCurrency(totalAmount)}
              </Text>
            </Text>
          </View>
          {/* <FlatList
            data={this.state.transactions}
            keyExtractor={item => String(item.id)}
            renderItem={this.renderTransaction}
          /> */}
        </ScrollView>

        <Tabs items={tabItems} />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  headerTextContainer: {
    padding: 10,
  },
  headerText: {
    color: 'white',
    fontSize: FONT_SIZES.REGULAR,
  },
})

export default withAccounts(AccountDetailsScreen)
