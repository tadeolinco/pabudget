import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BudgetGroup } from '../entities'
import { COLORS } from '../utils'
import BudgetListItem from './BudgetListItem'
import BudgetListItemHeader from './BudgetListItemHeader'

type Props = {
  group: BudgetGroup
  first: boolean
  computed: {
    budget: number
    used: number
    perItem: object
  }
}

const BudgetList = ({ group, first = false, computed }: Props) => {
  return (
    <View style={[styles.container, { borderTopWidth: first ? 0 : 20 }]}>
      <BudgetListItemHeader
        name={group.name}
        totalBudget={computed.budget}
        totalAvailable={computed.budget - computed.used}
      />
      {group.items.map((item, index: number) => (
        <BudgetListItem
          key={item.id}
          item={item}
          available={item.budget - computed.perItem[item.id]}
          last={index === group.items.length - 1}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: COLORS.GRAY,
  },
})

export default BudgetList
