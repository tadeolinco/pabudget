import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Header } from '../../components'
import { withBudget, BudgetContext } from '../../context'
import { NavigationScreenProp } from 'react-navigation'
import { Account, Budget } from '../../entities'
import { FONT_SIZES, COLORS, toCurrency } from '../../utils'
import { format, isToday } from 'date-fns'
import { BudgetHeader } from './components'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {
  budget: Budget
  transactions: any[]
}

class BudgetTransactionsScreen extends Component<Props, State> {
  state: State = {
    budget: null,
    transactions: [],
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
      </View>
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

export default withBudget(BudgetTransactionsScreen)
