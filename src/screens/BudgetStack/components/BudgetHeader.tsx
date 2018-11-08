import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'

type Props = {
  budget: number
  available: number
  total?: boolean
}

const BudgetHeader = ({ budget, available, total = true }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.budgetContainer}>
        <Text style={styles.text}>{total && 'Total'} Budgeted</Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>
          {toCurrency(budget)}
        </Text>
      </View>
      <View
        style={[
          styles.availableContainer,
          {
            backgroundColor:
              available > 0
                ? COLORS.GREEN
                : available < 0
                  ? COLORS.RED
                  : COLORS.GRAY,
          },
        ]}
      >
        <Text style={styles.text}>{total && 'Total'} Available</Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>
          {toCurrency(available)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  budgetContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
  },
  availableContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
  },
})

export default BudgetHeader
