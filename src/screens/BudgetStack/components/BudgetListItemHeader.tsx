import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'

type Props = {
  name: string
  totalBudget: number
  totalAvailable: number
}

const BudgetListItemHeader = ({ name, totalAvailable, totalBudget }: Props) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.nameContainer}>
        <Text style={[styles.text]}>{name}</Text>
      </View>
      <View style={styles.numberContainer}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={[
              styles.text,
              {
                color:
                  totalBudget === 0
                    ? COLORS.DARK_GRAY
                    : totalBudget > 0
                      ? COLORS.BLUE
                      : COLORS.RED,
              },
            ]}
          >
            Budgeted
          </Text>
          <Text
            style={[
              styles.text,
              {
                color:
                  totalBudget === 0
                    ? COLORS.DARK_GRAY
                    : totalBudget > 0
                      ? COLORS.BLUE
                      : COLORS.RED,
              },
            ]}
          >
            {toCurrency(totalBudget)}
          </Text>
        </View>
      </View>
      <View style={[styles.numberContainer]}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={[
              styles.text,
              {
                color:
                  totalAvailable === 0
                    ? COLORS.DARK_GRAY
                    : totalAvailable > 0
                      ? COLORS.GREEN
                      : COLORS.RED,
              },
            ]}
          >
            Available
          </Text>
          <Text
            style={[
              styles.text,
              {
                color:
                  totalAvailable === 0
                    ? COLORS.DARK_GRAY
                    : totalAvailable > 0
                      ? COLORS.GREEN
                      : COLORS.RED,
              },
            ]}
          >
            {toCurrency(totalAvailable)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: 50,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  numberContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 2,
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'bold',
  },
})

export default BudgetListItemHeader
