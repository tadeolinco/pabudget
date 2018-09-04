import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BudgetGroup } from '../entities'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  data: BudgetGroup
  sortHandlers?: any
  last: boolean
}

const AddBudgetGroup = ({ data, sortHandlers, last }: Props) => {
  return (
    <View style={[styles.container, { borderBottomWidth: last ? 0 : 20 }]}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.groupName}>{data.name}</Text>
      </View>
      <TouchableOpacity
        {...sortHandlers}
        style={{ justifyContent: 'center', paddingHorizontal: 10 }}
      >
        <Icon
          name="grip-horizontal"
          color={COLORS.BLACK}
          size={FONT_SIZES.TINY}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderColor: COLORS.GRAY,
  },
  groupName: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'bold',
  },
})

export default AddBudgetGroup
