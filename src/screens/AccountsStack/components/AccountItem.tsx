import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Account } from '../../../entities'
import { COLORS, FONT_SIZES, toCurrency } from '../../../utils'
import Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
  account: Account
  totalAmount: number
}

const AccountItem = ({ account: { name }, totalAmount }: Props) => {
  console.log(totalAmount)
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.text}>{name}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Text style={[styles.text]}>{toCurrency(totalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
        >
          <Icon
            name="chevron-right"
            style={{ color: COLORS.BLACK, fontSize: FONT_SIZES.TINIER }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 50,
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'normal',
  },
})

export default AccountItem
