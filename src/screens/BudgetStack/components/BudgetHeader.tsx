import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'

type Props = {
  totalBudget: number
  totalAvailable: number
}

const BudgetHeader = ({ totalBudget, totalAvailable }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.totalBudgetContainer}>
        <Text style={styles.text}>Total Budgeted</Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>
          {toCurrency(totalBudget)}
        </Text>
      </View>
      <View
        style={[
          styles.totalAvailableContainer,
          {
            backgroundColor:
              totalAvailable > 0
                ? COLORS.GREEN
                : totalAvailable < 0
                  ? COLORS.RED
                  : COLORS.GRAY,
          },
        ]}
      >
        <Text style={styles.text}>Total Available</Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>
          {toCurrency(totalAvailable)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  totalBudgetContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
  },
  totalAvailableContainer: {
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
