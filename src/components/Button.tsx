import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
} from 'react-native'
import { COLORS, FONT_SIZES } from '../utils'
import Color from 'color'

type Props = {
  text: string
  onPress: () => void
  rounded?: boolean
  buttonColor?: string
  textColor?: string
  disabled?: boolean
  full?: boolean
  loading?: boolean
}

const Button = ({
  text,
  onPress,
  rounded = false,
  buttonColor = COLORS.BLACK,
  textColor = 'white',
  disabled = false,
  full = false,
  loading = false,
}: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableHighlight
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.button,
          {
            borderRadius: rounded ? 5 : 0,
            backgroundColor: disabled ? COLORS.GRAY : buttonColor,
            flex: full ? 1 : 0,
          },
        ]}
        underlayColor={Color(buttonColor).darken(0.25)}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            style={[styles.text, { color: disabled ? 'white' : textColor }]}
          >
            {text}
          </Text>
        )}
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: { fontSize: FONT_SIZES.TINY },
})

export default Button
