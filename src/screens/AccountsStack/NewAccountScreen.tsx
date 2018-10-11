import React, { Fragment, Component } from 'react'
import { StyleSheet, View, Text, Keyboard } from 'react-native'
import { Header, Tabs, Input, Loader, CurrencyInput } from '../../components'
import { FONT_SIZES, COLORS, toCurrency } from '../../utils'
import { withAccounts, AccountsContext } from '../../context'
import { NavigationScreenProp } from 'react-navigation'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {
  name: string
  initialValue: number
  selection: {
    start: number
    end: number
  }
}

class NewAccountScreen extends Component<Props, State> {
  state: State = {
    name: '',
    initialValue: 0,
    selection: {
      start: 0,
      end: 0,
    },
  }

  handleChangeName = (text: string) => this.setState({ name: text })

  handleAddAccount = async () => {
    Keyboard.dismiss()
    await this.props.accountsContext.addAccount(
      this.state.name.trim(),
      this.state.initialValue
    )
    this.props.navigation.goBack()
  }

  render() {
    const tabItems = [
      {
        text: 'Add Account',
        icon: 'check',
        onPress: this.handleAddAccount,
        disabled: !this.state.name.trim(),
      },
    ]

    return (
      <Fragment>
        <Header title="New Account" hasBack />
        <View style={styles.container}>
          <Text style={styles.label}>Account Name</Text>
          <View style={styles.itemContainer}>
            <Input
              style={styles.input}
              placeholder="Savings"
              value={this.state.name}
              onChangeText={this.handleChangeName}
            />
          </View>
          <Text style={styles.label}>Initial Value</Text>
          <View style={styles.itemContainer}>
            <CurrencyInput
              value={this.state.initialValue}
              onChange={initialValue => this.setState({ initialValue })}
              useDefaultStyles
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <Tabs items={tabItems} />
        <Loader
          active={this.props.accountsContext.isAddingAccount}
          text="Adding account..."
        />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  label: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.BLACK,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
})

export default withAccounts(NewAccountScreen)
