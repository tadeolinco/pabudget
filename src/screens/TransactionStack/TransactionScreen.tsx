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
  BudgetGroup,
  BudgetItem,
  AccountTransaction,
} from '../../entities'
import { COLORS, FONT_SIZES, isSame, toCurrency } from '../../utils'
import { getRepository } from 'typeorm/browser'

type Props = {
  accountsContext: AccountsContext
  budgetContext: BudgetContext
}

/*
  I will <PAY> <AMOUNT> for <GROUP> using my <ACCOUNT> account. 
  I will <TRANSFER> <AMOUNT> to my <ACCOUNT> from my <ACCOUNT>.
*/

type State = {
  action: 'PAY' | 'TRANSFER'
  to?: BudgetItem | Account
  amount: number
  from?: Account
  note: string

  isAddingTransaction: boolean

  toOptions: {
    value: Account | BudgetItem
    label: string
  }[]

  fromOptions: {
    value: Account
    label: string
  }[]
}

class TransactionScreen extends Component<Props, State> {
  state: State = {
    action: 'PAY',
    to: null,
    amount: 0,
    from: null,
    note: '',

    isAddingTransaction: false,

    toOptions: [],
    fromOptions: [],
  }

  actionOptions = [{ value: 'PAY' }, { value: 'TRANSFER' }]

  componentDidMount() {
    const fromOptions = this.props.accountsContext.accounts.map(account => ({
      value: account,
      label: `${account.name} (Account)`,
    }))

    let toOptions: {
      value: Account | BudgetItem
      label: string
    }[] = [...fromOptions]

    if (this.state.action === 'PAY') {
      for (const group of this.props.budgetContext.groups) {
        for (const item of group.items) {
          toOptions.push({
            value: item,
            label: `${item.name} (Budget)`,
          })
        }
      }
    }

    this.setState({
      // toOptions,
      // fromOptions: [...fromOptions, { value: null, label: 'None' }],
      to: toOptions[0] ? toOptions[0].value : null,
    })
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    console.log(this.state.to)
    if (
      prevProps.accountsContext.accounts.length !==
      this.props.accountsContext.accounts.length
    ) {
      this.componentDidMount()
    }

    if (
      !isSame(prevProps.budgetContext.groups, this.props.budgetContext.groups)
    ) {
      this.componentDidMount()
    }

    if (prevState.action !== this.state.action) {
      const toOptions = []
      for (const group of this.props.budgetContext.groups) {
        for (const item of group.items) {
          toOptions.push({
            value: item,
            label: `${item.name} (Budget)`,
          })
        }
      }
      if (this.state.action === 'PAY') {
        for (const account of this.props.accountsContext.accounts) {
          toOptions.push({
            value: account,
            label: `${account.name} (Account)`,
          })
        }
      }
      this.setState({
        toOptions,
        to: toOptions.find(option => isSame(this.state.to, option))
          ? this.state.to
          : toOptions[0]
            ? toOptions[0].value
            : null,
      })
    }
  }

  handleAddTransaction = () => {
    this.setState({ isAddingTransaction: true })

    try {
      const transactionRepository = getRepository(AccountTransaction)
      const newTransaction = new AccountTransaction()

      // newTransaction.amount =
    } catch (err) {
      console.warn(err)
    }

    this.setState({ isAddingTransaction: true })
  }

  render() {
    return (
      <Fragment>
        <Header title="Transaction" />
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.label}>ACTION: </Text>
            <Picker
              value={this.state.action}
              items={this.actionOptions}
              onChange={value => this.setState({ action: value })}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>AMOUNT: </Text>
            <CurrencyInput
              value={this.state.amount}
              onChange={amount => this.setState({ amount })}
              useDefaultStyles
              style={{ fontSize: FONT_SIZES.REGULAR, color: COLORS.BLACK }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>TO: </Text>
            <Picker
              value={this.state.to}
              items={this.state.toOptions}
              onChange={value => this.setState({ to: value })}
              renderValue={value => (value ? value.name : 'None')}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>FROM: </Text>
            <Picker
              value={this.state.from}
              items={this.state.fromOptions}
              onChange={value => this.setState({ from: value })}
              renderValue={value => (value ? value.name : 'None')}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NOTE: </Text>
            <Input
              value={this.state.note}
              onChangeText={note => this.setState({ note })}
            />
          </View>
        </View>
        <Button
          text="ADD"
          buttonColor={'red'}
          onPress={this.handleAddTransaction}
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.REGULAR,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default withBudget(withAccounts(TransactionScreen))
