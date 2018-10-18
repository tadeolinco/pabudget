import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  TouchableHighlight,
  Keyboard,
} from 'react-native'
import { Budget } from '../../../entities'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'
import { CurrencyInput } from '../../../components'
import Interactable from 'react-native-interactable'
import { AnimatedValue } from 'react-navigation'
import Color from 'color'
import Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
  budget: Budget
  available: number
  updateBudget: (newBudget: Budget) => void
  sortHandlers?: any
}

type State = {
  tempAmount: number
  isFocused: boolean
  buttonSize: number
}

class BudgetListItem extends React.Component<Props, State> {
  private input!: TextInput
  private _deltaX: AnimatedValue
  private snapPoint = 100

  constructor(props: Props) {
    super(props)
    this.state = {
      tempAmount: 0,
      isFocused: false,
      buttonSize: 0,
    }

    this._deltaX = new Animated.Value(0)
  }

  handlePressBudget = () => {
    this.input.focus()
    this.setState({
      isFocused: true,
      tempAmount: 0,
    })
  }

  handleSubmitBudget = async () => {
    await this.props.updateBudget({
      ...this.props.budget,
      amount: this.state.tempAmount,
    })
    Keyboard.dismiss()
    this.setState({ isFocused: false, tempAmount: 0 })
  }

  render() {
    const {
      available,
      budget: { name, amount },
    } = this.props

    const xInterpolate = this._deltaX.interpolate({
      inputRange: [0, this.snapPoint],
      outputRange: [-this.snapPoint, 0],
    })

    return (
      <View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            flexDirection: 'row',
          }}
        >
          <Animated.View
            style={[
              {
                height: this.state.buttonSize,
                width: this.state.buttonSize,
              },
              { transform: [{ translateX: xInterpolate }] },
            ]}
          >
            <TouchableHighlight
              underlayColor={Color(COLORS.DARK_GRAY).darken(0.25)}
              style={{
                height: this.state.buttonSize,
                width: this.state.buttonSize,
                backgroundColor: COLORS.DARK_GRAY,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              {...this.props.sortHandlers}
            >
              <Icon
                name="grip-horizontal"
                style={{ fontSize: FONT_SIZES.REGULAR, color: 'white' }}
              />
            </TouchableHighlight>
          </Animated.View>
          <Animated.View
            style={[
              {
                height: this.state.buttonSize,
                width: this.state.buttonSize,
              },
              { transform: [{ translateX: xInterpolate }] },
            ]}
          >
            <TouchableHighlight
              underlayColor={Color(COLORS.RED).darken(0.25)}
              style={{
                height: this.state.buttonSize,
                width: this.state.buttonSize,
                backgroundColor: COLORS.RED,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {}}
            >
              <Icon
                name="trash-alt"
                style={{ fontSize: FONT_SIZES.REGULAR, color: 'white' }}
              />
            </TouchableHighlight>
          </Animated.View>
        </View>
        <Interactable.View
          horizontalOnly
          snapPoints={[{ x: 0 }, { x: this.snapPoint }]}
          springPoints={[
            {
              x: 0,
              tension: 6000,
              damping: 0.5,
              influenceArea: { right: 0 },
            },
          ]}
          animatedValueX={this._deltaX}
        >
          <View
            style={[styles.container]}
            onLayout={({
              nativeEvent: {
                layout: { height },
              },
            }) => {
              this.setState({ buttonSize: height })
              this.snapPoint = height * 2
            }}
          >
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
                      ? this.state.tempAmount === 0
                        ? COLORS.DARK_GRAY
                        : this.state.tempAmount > 0
                          ? COLORS.BLUE
                          : COLORS.RED
                      : amount === 0
                        ? COLORS.DARK_GRAY
                        : amount > 0
                          ? COLORS.BLUE
                          : COLORS.RED,
                    zIndex: 1,
                  },
                ]}
              >
                {toCurrency(
                  this.state.isFocused ? this.state.tempAmount : amount
                )}
              </Text>
              <CurrencyInput
                ref={currencyInput => {
                  if (currencyInput) {
                    this.input = currencyInput.input
                  }
                }}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  zIndex: -10,
                  width: 0,
                  height: 0,
                }}
                value={this.state.tempAmount}
                onChange={tempAmount => this.setState({ tempAmount })}
                onSubmit={this.handleSubmitBudget}
                onFocus={() => {
                  this.setState({ tempAmount: 0 })
                }}
                onBlur={() => this.setState({ isFocused: false })}
                blurOnSubmit={false}
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
        </Interactable.View>
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
