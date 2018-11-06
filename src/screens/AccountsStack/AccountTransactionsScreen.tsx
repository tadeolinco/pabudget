import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Header } from '../../components'
import { AccountsContext, withAccounts } from '../../context'
import { NavigationScreenProp } from 'react-navigation'
import { Account } from '../../entities'
import { FONT_SIZES, COLORS, toCurrency } from '../../utils'
import { AccountsHeader } from './components'
import { format, isToday } from 'date-fns'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {
  account: Account
  transactions: any[]
  totalAssets: number
  totalLiabilities: number
}

class AccountDetailsScreen extends Component<Props, State> {
  state: State = {
    account: null,
    transactions: [],
    totalAssets: 0,
    totalLiabilities: 0,
  }

  componentDidMount() {
    const account: Account = this.props.navigation.getParam('account')

    const transactions = [
      ...account.transactionsFromAccounts,
      ...account.transactionsToAccounts,
      ...account.transactionsToBudgets,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    let totalAssets = 0
    let totalLiabilities = 0

    for (const transaction of transactions) {
      if (
        transaction.fromAccount &&
        transaction.fromAccount.name === account.name
      ) {
        totalLiabilities -= transaction.amount
      } else {
        totalAssets += transaction.amount
      }
    }

    this.setState({ account, transactions, totalAssets, totalLiabilities })
  }

  renderTransaction = ({ item: transaction }) => {
    const transactionDate = new Date(transaction.createdAt)
    const isTransactionDateToday = isToday(transactionDate)

    return (
      <View style={styles.row}>
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.text}>
            {format(
              transactionDate,
              isTransactionDateToday ? 'HH:mm' : 'MM/DD'
            )}
          </Text>
        </View>

        <View style={[styles.cell]}>
          <Text style={styles.text}>
            {transaction.fromAccount &&
            transaction.fromAccount.name === this.state.account.name
              ? `To ${
                  transaction.toAccount
                    ? transaction.toAccount.name
                    : transaction.toBudget.name
                }`
              : transaction.fromAccount
                ? `From ${transaction.fromAccount.name}`
                : `To ${this.state.account.name}`}
          </Text>
        </View>

        <View style={[styles.cell]}>
          <Text style={styles.text}>
            {transaction.note ? transaction.note : '—'}
          </Text>
        </View>

        <View style={[styles.cell, { alignItems: 'flex-end' }]}>
          <Text
            style={[
              styles.text,
              {
                color: COLORS.WHITE,
                backgroundColor:
                  transaction.fromAccount &&
                  transaction.fromAccount.name === this.state.account.name
                    ? COLORS.RED
                    : COLORS.GREEN,
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 2,
              },
            ]}
          >
            {toCurrency(transaction.amount)}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    if (!this.state.account) return null

    return (
      <Fragment>
        <Header title={`${this.state.account.name} Transcations`} hasBack />
        <AccountsHeader
          netWorth={this.props.accountsContext.amountPerAccount.get(
            this.state.account.id
          )}
          totalAssets={this.state.totalAssets}
          totalLiabilities={this.state.totalLiabilities}
        />
        <View style={styles.row}>
          <View style={[styles.cell, { flex: 2 }]}>
            <Text style={styles.headerText}>Time</Text>
          </View>

          <View style={[styles.cell]}>
            <Text style={styles.headerText}>From/To</Text>
          </View>

          <View style={[styles.cell]}>
            <Text style={styles.headerText}>Note</Text>
          </View>

          <View style={[styles.cell, { alignItems: 'flex-end' }]}>
            <Text style={[styles.headerText]}>Amount</Text>
          </View>
        </View>
        <FlatList
          style={{ flex: 1, backgroundColor: 'white' }}
          keyExtractor={(item, index) => String(index)}
          data={this.state.transactions}
          renderItem={this.renderTransaction}
        />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.TINIER,
    color: COLORS.BLACK,
  },
  headerText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
  cell: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY,
    height: 50,
    padding: 10,
  },
})

export default withAccounts(AccountDetailsScreen)
