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
    <View style={[styles.container]}>
      <View style={styles.row}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.groupName}>{data.name}</Text>
        </View>
        <TouchableOpacity {...sortHandlers} style={styles.iconContainer}>
          <Icon
            name="grip-horizontal"
            color={COLORS.BLACK}
            size={FONT_SIZES.TINY}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.GRAY,
  },
  row: {
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 10,
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
  groupName: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'bold',
  },
  itemName: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'normal',
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
})

export default AddBudgetGroup
