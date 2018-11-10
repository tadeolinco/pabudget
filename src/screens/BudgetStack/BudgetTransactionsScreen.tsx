import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { Header, Loader } from '../../components'
import {
  withBudget,
  BudgetContext,
  withAccounts,
  AccountsContext,
} from '../../context'
import { NavigationScreenProp } from 'react-navigation'
import { Account, Budget, BudgetTransaction } from '../../entities'
import { FONT_SIZES, COLORS, toCurrency } from '../../utils'
import { format, isToday } from 'date-fns'
import { BudgetHeader } from './components'
import { getRepository } from 'typeorm/browser'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
  accountsContext: AccountsContext
}

type State = {
  budget: Budget
  transactions: any[]
  isDeletingTransaction: boolean
}

class BudgetTransactionsScreen extends Component<Props, State> {
  state: State = {
    budget: null,
    transactions: [],
    isDeletingTransaction: false,
  }

  handleDeleteTransaction = (transaction: BudgetTransaction) => {
    Alert.alert('Are you sure you want to delete this transaction?', '', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          this.setState({ isDeletingTransaction: true })
          await getRepository(BudgetTransaction).delete(transaction.id)
          await this.props.budgetContext.fetchBudgets()
          await this.props.accountsContext.fetchAccounts()
          this.setState({ isDeletingTransaction: false })
        },
      },
    ])
  }

  componentDidMount() {
    const budget: Budget = this.props.navigation.getParam('budget')

    const transactions = budget.transactionsFromAccounts
      .slice(0)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    this.setState({ budget, transactions })
  }

  renderTransaction = ({ item: transaction }) => {
    const transactionDate = new Date(transaction.createdAt)
    const isTransactionDateToday = isToday(transactionDate)

    return (
      <TouchableOpacity
        style={styles.row}
        onLongPress={() => this.handleDeleteTransaction(transaction)}
      >
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.text}>
            {format(
              transactionDate,
              isTransactionDateToday ? 'HH:mm' : 'MM/DD'
            )}
          </Text>
        </View>

        <View style={[styles.cell]}>
          <Text style={styles.text}>{transaction.fromAccount.name}</Text>
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
                backgroundColor: COLORS.GREEN,
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 2,
              },
            ]}
          >
            {toCurrency(transaction.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (!this.state.budget) return null

    return (
      <Fragment>
        <Header title={`${this.state.budget.name} Transactions`} hasBack />
        <BudgetHeader
          total
          budget={this.state.budget.amount}
          available={this.props.budgetContext.availablePerBudget.get(
            this.state.budget.id
          )}
        />
        {this.state.transactions.length ? (
          <Fragment>
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 2 }]}>
                <Text style={styles.headerText}>Time</Text>
              </View>

              <View style={[styles.cell]}>
                <Text style={styles.headerText}>From</Text>
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
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'white',
            }}
          >
            <Text style={styles.text}>No transactions yet.</Text>
          </View>
        )}
        <Loader
          active={this.state.isDeletingTransaction}
          text="Deleting transaction..."
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

export default withAccounts(withBudget(BudgetTransactionsScreen))
