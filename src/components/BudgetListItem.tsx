import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { BudgetContext, withBudget } from '../context'
import { BudgetItem } from '../entities'
import { COLORS, FONT_SIZES, toCurrency } from '../utils'

type Props = {
  item: BudgetItem
  available: number
  budgetContext?: BudgetContext
}

type State = {
  tempBudget: string
  isFocused: boolean
}

class BudgetListItem extends React.Component<Props, State> {
  private input!: TextInput

  state: State = {
    tempBudget: '',
    isFocused: false,
  }

  handlePressBudget = () => {
    this.setState({
      isFocused: true,
      tempBudget: '',
    })
    this.input.focus()
  }

  handleChangeBudget = (text: string) => {
    const before = this.state.tempBudget
    if (text.length >= this.state.tempBudget.length) {
      const lastCharacter = text[text.length - 1]
      if (isNaN(+lastCharacter) || lastCharacter === ' ') return
      this.setState({ tempBudget: this.state.tempBudget + lastCharacter })
    } else {
      // handle backspace
      this.setState({ tempBudget: text })
    }
  }

  handleBlurBudget = async () => {
    const {
      item,
      budgetContext: { updateBudget },
    } = this.props
    await updateBudget({ ...item, budget: +this.state.tempBudget })
    this.setState({ isFocused: false })
  }

  render() {
    const {
      available,
      item: { name, budget },
    } = this.props

    return (
      <View style={[styles.container]}>
        <View style={styles.nameContainer}>
          <Text style={[styles.text]}>{name}</Text>
        </View>
        <TouchableOpacity
          style={styles.numberContainer}
          onPress={this.handlePressBudget}
        >
          <Text
            style={[
              styles.text,
              {
                color: this.state.isFocused
                  ? +this.state.tempBudget === 0
                    ? COLORS.DARK_GRAY
                    : +this.state.tempBudget > 0
                      ? COLORS.BLUE
                      : COLORS.RED
                  : budget === 0
                    ? COLORS.DARK_GRAY
                    : budget > 0
                      ? COLORS.BLUE
                      : COLORS.RED,
                zIndex: 1,
              },
            ]}
          >
            {toCurrency(this.state.isFocused ? this.state.tempBudget : budget)}
          </Text>

          <TextInput
            ref={(input: TextInput) => (this.input = input)}
            style={styles.hide}
            keyboardType="numeric"
            value={this.state.tempBudget}
            onChangeText={this.handleChangeBudget}
            onBlur={this.handleBlurBudget}
            selectTextOnFocus
          />
        </TouchableOpacity>
        <View style={[styles.numberContainer]}>
          <Text
            adjustsFontSizeToFit
            style={[
              styles.text,
              {
                color: COLORS.WHITE,
                backgroundColor:
                  available === 0
                    ? COLORS.DARK_GRAY
                    : available > 0
                      ? COLORS.GREEN
                      : COLORS.RED,
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 2,
              },
            ]}
          >
            {toCurrency(available)}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: 50,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  numberContainer: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'normal',
  },
  hide: {
    position: 'absolute',
    top: 0,
    opacity: 0,
    zIndex: -10,
  },
})

export default withBudget(BudgetListItem)
