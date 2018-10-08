import React, { Fragment, Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import MainTabs from './MainTabs'
import { Header, Modal, Picker, Input, Loader } from '../components'
import {
  withAccounts,
  AccountsContext,
  withBudget,
  BudgetContext,
} from '../context'
import { Account, BudgetGroup } from '../entities'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  accountsContext: AccountsContext
  budgetContext: BudgetContext
}

/*
  I will <PAY> <AMOUNT> for <GROUP> using my <ACCOUNT> account. 
  I will <TRANSFER> <AMOUNT> to my <ACCOUNT> from my <ACCOUNT>.
*/

type State = {
  verb: 'PAY' | 'TRANSFER'
  to: number
  amount: number
  from: number
}

class TransactionScreen extends Component<Props, State> {
  state: State = {
    verb: 'PAY',
    to: null,
    amount: 0,
    from: null,
  }

  render() {
    const verbOptions = [{ value: 'PAY' }, { value: 'TRANSFER' }]

    const fromOptions = this.props.accountsContext.accounts.map(account => ({
      value: account,
      label: account.name,
    }))

    let toOptions: {
      value: Account | BudgetGroup
      label: string
    }[] = [...fromOptions]

    if (this.state.verb === 'PAY') {
      toOptions = [
        ...this.props.budgetContext.groups.map(group => ({
          value: group,
          label: group.name,
        })),
        ...fromOptions,
      ]
    }

    return (
      <Fragment>
        <Header title="Transaction" />
        <View style={styles.container}>
          <Picker
            value={this.state.verb}
            items={verbOptions}
            onChange={value => this.setState({ verb: value })}
          />
          <Picker
            value={this.state.to}
            items={toOptions}
            onChange={value => this.setState({ to: value })}
            renderValue={value => value && value.name}
          />
          <Picker
            value={this.state.from}
            items={fromOptions}
            onChange={value => this.setState({ from: value })}
            renderValue={value => value && value.name}
          />
        </View>
        <MainTabs />
        {/* <Loader
          active={this.props.accountsContext.isFetchingAccounts}
          text="Getting your budget groups..."
        /> */}
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
  },
})

export default withBudget(withAccounts(TransactionScreen))
