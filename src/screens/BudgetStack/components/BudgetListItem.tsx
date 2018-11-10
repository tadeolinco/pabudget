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
  Dimensions,
  Alert,
} from 'react-native'
import { Budget } from '../../../entities'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'
import { CurrencyInput } from '../../../components'
import Interactable from 'react-native-interactable'
import {
  AnimatedValue,
  withNavigation,
  NavigationScreenProp,
} from 'react-navigation'
import Color from 'color'
import Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
  budget: Budget
  available: number
  updateBudget: (newBudget: Budget) => void
  deleteBudget: (targetBudget: Budget) => void
  sortHandlers?: any
  navigation: NavigationScreenProp<any>
  showTransactions: (budget: Budget) => void
}

type State = {
  tempAmount: number
  tempName: string
  isAmountFocused: boolean
  isNameFocused: boolean
  buttonSize: number
}

const deviceWidth = Dimensions.get('screen').width

class BudgetListItem extends React.Component<Props, State> {
  private amountInput!: TextInput
  private nameInput!: TextInput
  private _deltaX: AnimatedValue
  private snapPoint = 100
  private interactableView: any

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

  handleAddBudgetTransaction = () => {
    this.props.navigation.navigate('Transaction', {
      toBudget: this.props.budget,
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

  handleDeleteBudget = async () => {
    Alert.alert(
      `Deleting ${this.props.budget.name}`,
      'Are you sure you want delete?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await this.props.deleteBudget(this.props.budget)
          },
        },
      ]
    )
  }

  handleShowTransactions = () => {
    this.interactableView.snapTo({ index: 0 })
    this.props.showTransactions(this.props.budget)
  }

  renderSlider = () => {
    const xInterpolate = this._deltaX.interpolate({
      inputRange: [0, this.snapPoint],
      outputRange: [deviceWidth, deviceWidth + this.snapPoint],
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
            underlayColor={Color(COLORS.RED).darken(0.25)}
            style={{
              height: this.state.buttonSize,
              width: this.state.buttonSize,
              backgroundColor: COLORS.RED,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.handleDeleteBudget}
          >
            <Icon
              name="trash-alt"
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
            underlayColor={Color(COLORS.BLUE).darken(0.25)}
            style={{
              height: this.state.buttonSize,
              width: this.state.buttonSize,
              backgroundColor: COLORS.BLUE,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.handleShowTransactions}
          >
            <Icon
              name="book"
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
          snapPoints={[{ x: 0 }, { x: -this.snapPoint }]}
          animatedValueX={this._deltaX}
          ref={ref => (this.interactableView = ref)}
        >
          <View
            style={[styles.container]}
            onLayout={({
              nativeEvent: {
                layout: { height },
              },
            }) => {
              this.setState({ buttonSize: height })
              this.snapPoint = height * 3
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
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
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
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
                onBlur={() => {
                  this.setState({ isAmountFocused: false })
                }}
                blurOnSubmit={false}
                allowNegation
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.numberContainer]}
              onPress={this.handleAddBudgetTransaction}
            >
              <Text
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
            </TouchableOpacity>
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
    paddingHorizontal: 10,
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
    padding: 0,
  },
  hide: {
    position: 'absolute',
    top: 0,
    opacity: 0,
    zIndex: -10,
  },
})

export default withNavigation(BudgetListItem)
