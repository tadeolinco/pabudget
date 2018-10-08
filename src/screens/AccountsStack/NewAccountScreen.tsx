import React, { Fragment, Component } from 'react'
import { StyleSheet, View, Text, Keyboard } from 'react-native'
import { Header, Tabs, Input, Loader } from '../../components'
import { FONT_SIZES, COLORS, toCurrency } from '../../utils'
import { withAccounts, AccountsContext } from '../../context'
import { NavigationScreenProp } from 'react-navigation'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {
  name: string
  initialValue: string
  selection: {
    start: number
    end: number
  }
}

class NewAccountScreen extends Component<Props, State> {
  state: State = {
    name: '',
    initialValue: '0',
    selection: {
      start: 0,
      end: 0,
    },
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  handleChangeName = (text: string) => this.setState({ name: text })

  handleChangeValue = (text: string) => {
    if (text.length >= toCurrency(+this.state.initialValue).length) {
      const lastCharacter = text[text.length - 1]
      if (
        (lastCharacter !== '-' && isNaN(+lastCharacter)) ||
        lastCharacter === ' '
      )
        return
      if (lastCharacter === '-') {
        // handle negation
        const newValue = String(-+this.state.initialValue)
        const selection = toCurrency(+newValue).length
        this.setState({
          initialValue: String(-+this.state.initialValue),
          selection: {
            start: selection,
            end: selection,
          },
        })
      } else {
        const newValue = String(+(this.state.initialValue + lastCharacter))
        const selection = toCurrency(+newValue).length

        this.setState({
          initialValue: String(+(this.state.initialValue + lastCharacter)),
          selection: {
            start: selection,
            end: selection,
          },
        })
      }
    } else {
      // handle backspace
      const newValue = String(Math.floor(+this.state.initialValue / 10))
      const selection = toCurrency(+newValue).length
      this.setState({
        initialValue: newValue,
        selection: {
          start: selection,
          end: selection,
        },
      })
    }
  }

  handleAddAccount = async () => {
    Keyboard.dismiss()
    await this.props.accountsContext.addAccount(
      this.state.name.trim(),
      +this.state.initialValue
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
            <Input
              style={styles.input}
              value={toCurrency(+this.state.initialValue)}
              onChangeText={this.handleChangeValue}
              keyboardType="number-pad"
              selection={this.state.selection}
              onFocus={() => {
                const selection = toCurrency(+this.state.initialValue).length
                this.setState({
                  selection: {
                    start: selection,
                    end: selection,
                  },
                })
              }}
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
