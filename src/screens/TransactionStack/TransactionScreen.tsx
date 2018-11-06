import React, { Fragment, Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import MainTabs from '../MainTabs'
import {
  Header,
  Picker,
  Loader,
  CurrencyInput,
  Input,
  Button,
} from '../../components'
import {
  withAccounts,
  AccountsContext,
  withBudget,
  BudgetContext,
} from '../../context'
import {
  Account,
  Budget,
  AccountTransaction,
  BudgetTransaction,
} from '../../entities'
import { COLORS, FONT_SIZES, isSame, toCurrency } from '../../utils'
import { getRepository } from 'typeorm/browser'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp } from 'react-navigation'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
  budgetContext: BudgetContext
}

type State = {
  to?: any
  amount: number
  from?: Account
  note: string

  isAddingTransaction: boolean

  toOptions: {
    value: Account | Budget
    label: string
  }[]

  fromOptions: {
    value: Account
    label: string
  }[]
}

class TransactionScreen extends Component<Props, State> {
  state: State = {
    to: null,
    amount: 0,
    from: null,
    note: '',

    isAddingTransaction: false,

    toOptions: [],
    fromOptions: [],
  }

  componentDidMount() {
    const fromOptions = this.props.accountsContext.accounts.map(account => ({
      value: account,
      label: `${account.name}`,
    }))

    let toOptions: {
      value: Account | Budget
      label: string
    }[] = []

    for (const budget of this.props.budgetContext.budgets) {
      toOptions.push({
        value: budget,
        label: `${budget.name}`,
      })
    }

    const toBudget = this.props.navigation.getParam('toBudget')
    this.setState({
      toOptions: [...toOptions, ...fromOptions],
      fromOptions: [...fromOptions, { value: null, label: 'None' }],
      to: toBudget ? toBudget : toOptions[0] ? toOptions[0].value : null,
      from: fromOptions[0] ? fromOptions[0].value : null,
    })
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.accountsContext.accounts.length !==
      this.props.accountsContext.accounts.length
    ) {
      this.componentDidMount()
    }

    if (
      !isSame(prevProps.budgetContext.budgets, this.props.budgetContext.budgets)
    ) {
      this.componentDidMount()
    }
  }

  handleAddTransaction = async () => {
    this.setState({ isAddingTransaction: true })
    const isToAccount = typeof this.state.to.amount === 'undefined'

    const accountTransactionRepository = getRepository(AccountTransaction)
    const budgetTransactionRepository = getRepository(BudgetTransaction)
    try {
      if (isToAccount) {
        const newTransaction = new AccountTransaction()
        newTransaction.note = this.state.note || null
        newTransaction.amount = this.state.amount
        newTransaction.fromAccount = this.state.from
        newTransaction.toAccount = this.state.to

        await accountTransactionRepository.save(newTransaction)
      } else {
        const newTransaction = new BudgetTransaction()
        newTransaction.note = this.state.note || null
        newTransaction.amount = this.state.amount
        newTransaction.fromAccount = this.state.from
        newTransaction.toBudget = this.state.to
        await budgetTransactionRepository.save(newTransaction)
      }
      await Promise.all([
        this.props.budgetContext.fetchBudgets(),
        this.props.accountsContext.fetchAccounts(),
      ])
    } catch (err) {
      console.warn(err)
    }

    this.setState({ isAddingTransaction: false })
    this.props.navigation.navigate('Budget')
  }

  render() {
    const submitDisabled =
      !this.state.amount ||
      !this.state.to ||
      isSame(this.state.to, this.state.from) ||
      (this.state.from === null && typeof this.state.to.amount !== 'undefined')

    return (
      <Fragment>
        <Header title="Transaction" />
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.label}>From: </Text>
            </View>
            <View style={styles.cell}>
              <Picker
                value={this.state.from}
                items={this.state.fromOptions}
                onChange={value => this.setState({ from: value })}
                renderValue={value =>
                  value ? (
                    <Fragment>
                      <Icon
                        name={'credit-card'}
                        style={[
                          styles.icon,
                          {
                            color:
                              typeof value.amount === 'undefined'
                                ? COLORS.BLUE
                                : COLORS.GREEN,
                          },
                        ]}
                      />{' '}
                      {value.name}
                    </Fragment>
                  ) : (
                    <Fragment>None</Fragment>
                  )
                }
                renderItem={item => (
                  <Fragment>
                    {item.value && (
                      <Icon
                        name={
                          typeof item.value.amount === 'undefined'
                            ? 'credit-card'
                            : 'money-bill-alt'
                        }
                        style={[
                          styles.icon,
                          {
                            color:
                              typeof item.value.amount === 'undefined'
                                ? COLORS.BLUE
                                : COLORS.GREEN,
                          },
                        ]}
                      />
                    )}
                    {item.value && ' '}
                    {item.label}
                  </Fragment>
                )}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.label}>To: </Text>
            </View>
            <View style={styles.cell}>
              <Picker
                value={this.state.to}
                items={this.state.toOptions}
                onChange={value => this.setState({ to: value })}
                renderValue={value =>
                  value ? (
                    <Fragment>
                      <Icon
                        name={
                          typeof value.amount === 'undefined'
                            ? 'credit-card'
                            : 'money-bill-alt'
                        }
                        style={[
                          styles.icon,
                          {
                            color:
                              typeof value.amount === 'undefined'
                                ? COLORS.BLUE
                                : COLORS.GREEN,
                          },
                        ]}
                      />{' '}
                      {value.name}
                    </Fragment>
                  ) : (
                    <Fragment>None</Fragment>
                  )
                }
                renderItem={item => (
                  <Fragment>
                    <Icon
                      name={
                        typeof item.value.amount === 'undefined'
                          ? 'credit-card'
                          : 'money-bill-alt'
                      }
                      style={[
                        styles.icon,
                        {
                          color:
                            typeof item.value.amount === 'undefined'
                              ? COLORS.BLUE
                              : COLORS.GREEN,
                        },
                      ]}
                    />{' '}
                    {item.label}
                  </Fragment>
                )}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.label}>Note: </Text>
            </View>
            <View style={styles.cell}>
              <Input
                value={this.state.note}
                onChangeText={note => this.setState({ note })}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.label}>Amount: </Text>
            </View>
            <View style={styles.cell}>
              <CurrencyInput
                value={this.state.amount}
                onChange={amount => this.setState({ amount })}
                useDefaultStyles
                style={{ fontSize: FONT_SIZES.REGULAR, color: COLORS.BLACK }}
                blurOnSubmit
              />
            </View>
          </View>
        </View>
        <Button
          full
          text="ADD"
          buttonColor={COLORS.BLUE}
          onPress={this.handleAddTransaction}
          disabled={submitDisabled}
        />
        <MainTabs />
        <Loader
          active={this.state.isAddingTransaction}
          text="Adding transaction..."
        />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.REGULAR,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.BLACK,
  },
  cell: { flex: 1 },
})

export default withBudget(withAccounts(TransactionScreen))
