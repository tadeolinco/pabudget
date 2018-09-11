import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  text: string
  onPress: () => void
  rounded?: boolean
  buttonColor?: string
  textColor?: string
  disabled?: boolean
}

const Button = ({
  text,
  onPress,
  rounded = false,
  buttonColor = COLORS.BLACK,
  textColor = 'white',
  disabled = false,
}: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableHighlight
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.button,
          { borderRadius: rounded ? 5 : 0 },
          { backgroundColor: disabled ? COLORS.GRAY : buttonColor },
        ]}
      >
        <Text style={[styles.text, { color: disabled ? 'white' : textColor }]}>
          {text}
        </Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: { fontSize: FONT_SIZES.REGULAR },
})

export default Button
