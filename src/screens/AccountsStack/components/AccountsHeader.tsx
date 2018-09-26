import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'
import { AccountsContext, withAccounts } from '../../../context'

type Props = {
  accountsContext?: AccountsContext
}

const AccountsHeader = ({
  accountsContext: { netWorth, totalAssets, totalDebts },
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.textContainer, { backgroundColor: COLORS.BLUE }]}>
        <Text style={styles.text}>Net Worth</Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>
          {toCurrency(netWorth)}
        </Text>
      </View>
      <View style={{ flex: 2 }}>
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: COLORS.GREEN,
            },
          ]}
        >
          <Text style={styles.text}>Assets</Text>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>
            {toCurrency(totalAssets)}
          </Text>
        </View>
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: COLORS.RED,
            },
          ]}
        >
          <Text style={styles.text}>Debts</Text>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>
            {toCurrency(totalDebts)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  rowContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
  },
})

export default withAccounts(AccountsHeader)
