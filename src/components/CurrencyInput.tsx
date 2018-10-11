import React, { Component } from 'react'
import { StyleSheet, TextInput, TextStyle, TextInputProps } from 'react-native'
import { toCurrency, COLORS, FONT_SIZES } from '../utils'

type Props = {
  value: number
  onChange: (number) => void
  onSubmit?: (number) => void
  style?: TextStyle
  useDefaultStyles?: boolean
}

type State = {
  value: string
  selection: {
    start: number
    end: number
  }
}

class CurrencyInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: String(this.props.value),
      selection: {
        start: 0,
        end: 0,
      },
    }
  }

  handleChangeValue = (text: string) => {
    if (text.length >= toCurrency(+this.state.value).length) {
      const lastCharacter = text[text.length - 1]
      if (
        (lastCharacter !== '-' && isNaN(+lastCharacter)) ||
        lastCharacter === ' '
      )
        return
      if (lastCharacter === '-') {
        // handle negation
        const newValue = String(-+this.state.value)
        const selection = toCurrency(+newValue).length
        this.setState(
          {
            value: String(-+this.state.value),
            selection: {
              start: selection,
              end: selection,
            },
          },
          () => this.props.onChange(+this.state.value)
        )
      } else {
        const newValue = String(+(this.state.value + lastCharacter))
        const selection = toCurrency(+newValue).length

        this.setState(
          {
            value: String(+(this.state.value + lastCharacter)),
            selection: {
              start: selection,
              end: selection,
            },
          },
          () => this.props.onChange(+this.state.value)
        )
      }
    } else {
      // handle backspace
      const newValue = String(Math.floor(+this.state.value / 10))
      const selection = toCurrency(+newValue).length
      this.setState(
        {
          value: newValue,
          selection: {
            start: selection,
            end: selection,
          },
        },
        () => this.props.onChange(+this.state.value)
      )
    }
  }

  render() {
    return (
      <TextInput
        style={[this.props.useDefaultStyles && styles.input, this.props.style]}
        value={toCurrency(+this.state.value)}
        onChangeText={this.handleChangeValue}
        keyboardType="number-pad"
        selection={this.state.selection}
        onSubmitEditing={this.props.onSubmit}
        onFocus={() => {
          const selection = toCurrency(+this.state.value).length
          this.setState({
            selection: {
              start: selection,
              end: selection,
            },
          })
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
  },
})

export default CurrencyInput
