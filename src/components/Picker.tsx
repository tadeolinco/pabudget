import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ViewStyle,
  FlatList,
} from 'react-native'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS, FONT_SIZES } from '../utils'

interface PickerItem {
  value: any
  label?: string
}

type Props = {
  value: any
  items: PickerItem[]
  placeholder?: string
  onChange: (value: any) => void
  renderValue?: (value: any, placeholder: string) => JSX.Element
  renderItem?: (item: PickerItem) => JSX.Element
  containerStyle?: ViewStyle
  touchableStyle?: ViewStyle
}

type State = {
  active: boolean
}

class Picker extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    containerStyle: {},
    touchableStyle: {},
  }

  state: State = {
    active: false,
  }

  toggleActive = () => this.setState({ active: !this.state.active })

  renderValue = value => {
    return (
      <Text style={styles.text}>
        {value === null && this.props.placeholder
          ? this.props.placeholder
          : this.props.renderValue
            ? this.props.renderValue(value, this.props.placeholder)
            : value}
      </Text>
    )
  }

  renderItem = (item: PickerItem, index: number) => {
    const isLast = index === this.props.items.length - 1

    return (
      <View
        key={index}
        style={[styles.itemContainer, !isLast && styles.lastItemContainer]}
      >
        <TouchableOpacity onPress={() => this.handleSelectItem(item.value)}>
          <Text style={styles.text}>
            {item.label
              ? item.label
              : this.props.renderItem
                ? this.props.renderItem(item)
                : item.value}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  handleSelectItem = (value: any) => {
    this.props.onChange(value)
    this.setState({ active: false })
  }

  render() {
    return (
      <Fragment>
        <View style={this.props.containerStyle}>
          <TouchableOpacity
            onPress={this.toggleActive}
            style={[styles.touchableValue, this.props.touchableStyle]}
          >
            {this.renderValue(this.props.value)}
            <Icon name="caret-down" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={this.state.active}
          onBackButtonPress={this.toggleActive}
          onBackdropPress={this.toggleActive}
        >
          {this.props.items.length ? (
            <View>
              <FlatList
                keyExtractor={(item, index) => String(index)}
                data={this.props.items}
                renderItem={({
                  item,
                  index,
                }: {
                  item: PickerItem
                  index: number
                }) => this.renderItem(item, index)}
              />
            </View>
          ) : (
            <TouchableWithoutFeedback onPress={this.toggleActive}>
              <View style={styles.itemContainer}>
                <Text style={styles.text}>No items</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </Modal>
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  touchableValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.REGULAR,
    marginLeft: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  lastItemContainer: {
    borderColor: COLORS.DARK_GRAY,
    borderBottomWidth: 1,
  },
  text: { color: COLORS.BLACK, fontSize: FONT_SIZES.REGULAR },
})

export default Picker
