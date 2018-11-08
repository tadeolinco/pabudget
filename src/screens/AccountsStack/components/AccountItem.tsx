import React, { Component, Ref } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  TouchableHighlight,
  Dimensions,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native'
import { Account } from '../../../entities'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'
import Interactable from 'react-native-interactable'
import Color from 'color'
import Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
  account: Account
  totalAmount: number
  showTransactions: (account: Account) => void
  deleteAccount: (targetAccount: Account) => void
  updateAccount: (newAccount: Account) => void
  sortHandlers?: any
}

type State = {
  buttonSize: number
  tempName: string
  isNameFocused: boolean
}

const deviceWidth = Dimensions.get('screen').width

class AccountItem extends Component<Props, State> {
  private _deltaX: Animated.Value
  private snapPoint = 100
  private interactableView: any
  private nameInput!: TextInput

  constructor(props: Props) {
    super(props)

    this.state = {
      buttonSize: 0,
      tempName: props.account.name,
      isNameFocused: false,
    }
    this._deltaX = new Animated.Value(0)
  }

  handleShowTransactions = () => {
    this.props.showTransactions(this.props.account)
  }

  handlePressName = () => {
    this.nameInput.focus()
    this.setState({
      tempName: this.props.account.name,
      isNameFocused: true,
    })
  }

  handleChangeName = tempName => {
    this.setState({ tempName })
  }

  handleSubmitAccountName = async () => {
    const trimmedNamed = this.state.tempName.trim()
    if (trimmedNamed) {
      await this.props.updateAccount({
        ...this.props.account,
        name: trimmedNamed,
      })
    }
    this.setState({ isNameFocused: false, tempName: this.props.account.name })
  }

  handleDeleteAccount = () => {
    Alert.alert(
      `Deleting ${this.props.account.name}`,
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
            await this.props.deleteAccount(this.props.account)
          },
        },
      ]
    )
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
            onPress={this.handleDeleteAccount}
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
            onPress={() => {
              this.interactableView.snapTo({ index: 0 })
              this.handleShowTransactions()
            }}
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
            style={styles.container}
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
                onSubmitEditing={this.handleSubmitAccountName}
                blurOnSubmit={false}
                onFocus={() =>
                  this.setState({ tempName: this.props.account.name })
                }
                onBlur={() =>
                  this.setState({
                    isNameFocused: false,
                    tempName: this.props.account.name,
                  })
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: COLORS.WHITE,
                    backgroundColor:
                      this.props.totalAmount === 0
                        ? COLORS.DARK_GRAY
                        : this.props.totalAmount > 0
                        ? COLORS.GREEN
                        : COLORS.RED,
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  },
                ]}
              >
                {toCurrency(this.props.totalAmount)}
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
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY,
    height: 50,
    paddingHorizontal: 10,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'normal',
    padding: 0,
  },
})

export default AccountItem
