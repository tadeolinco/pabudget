import React from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  value: boolean
  onValueChange: () => void
  style: ViewStyle
}

const CheckBox = ({ value, onValueChange, style = {} }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onValueChange}
        style={styles.touchable}
      >
        {value && (
          <Icon name="check" color={COLORS.BLACK} size={FONT_SIZES.TINY} />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CheckBox
