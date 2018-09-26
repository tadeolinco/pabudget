import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { BudgetGroup } from '../../../entities'
import { COLORS } from '../../../utils'
import BudgetListItem from './BudgetListItem'
import BudgetListItemHeader from './BudgetListItemHeader'

type Props = {
  group: BudgetGroup
  first: boolean
  totalPerGroup: {
    budget: number
    used: number
    perItem: Map<number, number>
  }
}

const BudgetList = ({ group, first = false, totalPerGroup }: Props) => {
  return (
    <View style={[styles.container, { borderTopWidth: first ? 0 : 20 }]}>
      <BudgetListItemHeader
        name={group.name}
        totalBudget={totalPerGroup.budget}
        totalAvailable={totalPerGroup.budget - totalPerGroup.used}
      />
      <FlatList
        keyExtractor={item => String(item.id)}
        data={group.items}
        extraData={totalPerGroup}
        renderItem={({ item }) => (
          <BudgetListItem
            key={item.id}
            item={item}
            available={item.budget - totalPerGroup.perItem.get(item.id)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: COLORS.GRAY,
  },
})

export default BudgetList
