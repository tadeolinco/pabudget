import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BudgetGroup } from '../entities'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  data: BudgetGroup
  sortHandlers?: any
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.REGULAR,
  },
})

const AddBudgetGroup = ({ data, sortHandlers }: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.text}>{data.name}</Text>
      </View>
      <TouchableOpacity
        {...sortHandlers}
        style={{ justifyContent: 'center', paddingHorizontal: 10 }}
      >
        <Icon
          name="grip-horizontal"
          color={COLORS.BLACK}
          size={FONT_SIZES.REGULAR}
        />
      </TouchableOpacity>
    </View>
  )
}

export default AddBudgetGroup
