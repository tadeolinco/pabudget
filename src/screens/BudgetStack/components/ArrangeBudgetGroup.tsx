import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import CheckBox from '../../../components/CheckBox'
import { BudgetGroup } from '../../../entities'
import { COLORS, FONT_SIZES } from '../../../utils'

type Props = {
  data: BudgetGroup
  selected: boolean
  handleSelect: (number) => void
  sortHandlers?: any
  navigation?: NavigationScreenProp<any>
}

const ArrangeBudgetGroup = ({
  data,
  selected,
  sortHandlers,
  handleSelect,
  navigation,
}: Props) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.row}>
        <CheckBox
          style={styles.checkBox}
          value={selected}
          onValueChange={() => {
            handleSelect(data.id)
          }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UpdateBudget', { group: data })
          }}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Text style={styles.groupName}>{data.name}</Text>
        </TouchableOpacity>

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
    padding: 10,
  },
  checkBox: {
    marginRight: 10,
  },
})

export default withNavigation(ArrangeBudgetGroup)
