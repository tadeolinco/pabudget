import React from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { COLORS, FONT_SIZES } from '../utils'

const Input = ({ style, ...props }: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      selectionColor={COLORS.DARK_GRAY}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    borderRadius: 1000,
  },
})

export default Input
