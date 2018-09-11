import React from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../utils'

type Props = {
  color?: string
  margin?: number
}

const Divider = ({ color = COLORS.GRAY, margin = 0 }: Props) => {
  return (
    <View style={[styles.container, { marginVertical: margin }]}>
      <View style={[styles.divider, { borderColor: color }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  divider: {
    flex: 1,
    borderTopWidth: 1,
  },
})

export default Divider
