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
  tempName: string
  isAmountFocused: boolean
  isNameFocused: boolean
  buttonSize: number
}

class BudgetListItem extends React.Component<Props, State> {
  private amountInput!: TextInput
  private nameInput!: TextInput
  private _deltaX: AnimatedValue
  private snapPoint = 100

  constructor(props: Props) {
    super(props)
    this.state = {
      tempAmount: 0,
      tempName: props.budget.name,
      isAmountFocused: false,
      isNameFocused: false,
      buttonSize: 0,
    }

    this._deltaX = new Animated.Value(0)
  }

  handlePressBudget = () => {
    this.amountInput.focus()
    this.setState({
      isAmountFocused: true,
      tempAmount: 0,
    })
  }

  handlePressName = () => {
    this.nameInput.focus()
    this.setState({
      tempName: this.props.budget.name,
      isNameFocused: true,
    })
  }

  handleChangeName = tempName => {
    this.setState({ tempName })
  }

  handleSubmitBudgetAmount = async () => {
    await this.props.updateBudget({
      ...this.props.budget,
      amount: this.state.tempAmount,
    })
    Keyboard.dismiss()
    this.setState({ isAmountFocused: false, tempAmount: 0 })
  }

  handleSubmitBudgetName = async () => {
    const trimmedNamed = this.state.tempName.trim()
    if (trimmedNamed) {
      await this.props.updateBudget({
        ...this.props.budget,
        name: trimmedNamed,
      })
    }
    Keyboard.dismiss()
    this.setState({ isNameFocused: false, tempName: this.props.budget.name })
  }

  renderSlider = () => {
    const xInterpolate = this._deltaX.interpolate({
      inputRange: [0, this.snapPoint],
      outputRange: [-this.snapPoint, 0],
    })
    return (
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
    )
  }

  render() {
    const {
      available,
      budget: { name, amount },
    } = this.props

    return (
      <View>
        {this.renderSlider()}
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
            <TouchableOpacity
              style={styles.nameContainer}
              onPress={this.handlePressName}
            >
              <TextInput
                editable={this.state.isNameFocused}
                ref={ref => (this.nameInput = ref)}
                style={styles.text}
                value={this.state.tempName}
                onChangeText={this.handleChangeName}
                onSubmitEditing={this.handleSubmitBudgetName}
                blurOnSubmit={false}
                onFocus={() =>
                  this.setState({ tempName: this.props.budget.name })
                }
                onBlur={() =>
                  this.setState({
                    isNameFocused: false,
                    tempName: this.props.budget.name,
                  })
                }
              />
              {/* <Text style={[styles.text]}>{name}</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={this.handlePressBudget}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: this.state.isAmountFocused
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
                  this.state.isAmountFocused ? this.state.tempAmount : amount
                )}
              </Text>
              <CurrencyInput
                ref={currencyInput => {
                  if (currencyInput) {
                    this.amountInput = currencyInput.input
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
                onSubmit={this.handleSubmitBudgetAmount}
                onFocus={() => {
                  this.setState({ tempAmount: 0 })
                }}
                onBlur={() => this.setState({ isAmountFocused: false })}
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
    height: 50,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  numberContainer: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 5,
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
