import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { BudgetItem } from '../entities'
import { COLORS, FONT_SIZES, toCurrency } from '../utils'

type Props = {
  item: BudgetItem
  available: number
}

type State = {
  tempBudget: string
  isFocused: boolean
}

class BudgetListItem extends React.Component<Props, State> {
  private input!: TextInput

  state = {
    tempBudget: this.props.item.budget.toString(),
    isFocused: false,
  }

  handlePressBudget = () => {
    this.setState({
      isFocused: true,
      tempBudget: this.props.item.budget.toString(),
    })
    this.input.focus()
  }

  handleChangeBudget = (text: string) => {
    if (text.length > this.state.tempBudget.length) {
      const lastCharacter = text[text.length - 1]
      if (isNaN(+lastCharacter) || lastCharacter === ' ') return
      this.setState({ tempBudget: this.state.tempBudget + lastCharacter })
    } else {
      this.setState({ tempBudget: text })
    }
  }

  handleBlurBudget = () => {
    // this.props.updateBudgetItem(this.props.groupId!, this.props._id!, {
    //   budget: +this.state.tempBudget,
    // });
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
                    ? COLORS.GRAY
                    : +this.state.tempBudget > 0
                      ? COLORS.BLUE
                      : COLORS.RED
                  : budget === 0
                    ? COLORS.GRAY
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
                    ? COLORS.GRAY
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

export default BudgetListItem
