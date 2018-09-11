import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS, FONT_SIZES } from '../utils'

interface TabItem {
  text: string
  icon: string
  onPress: () => void
  disabled?: boolean
}

type Props = {
  items: TabItem[]
}

const Tabs = ({ items }: Props) => {
  return (
    <View style={styles.tabs}>
      {items.map((item, index) => (
        <View
          style={[
            styles.tabItem,
            { borderRightWidth: index === items.length - 1 ? 0 : 1 },
          ]}
          key={index}
        >
          <TouchableOpacity
            disabled={item.disabled}
            onPress={item.onPress}
            style={styles.touchable}
          >
            <Icon name={item.icon} style={styles.icon} />
            <Text style={styles.text}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY,
    paddingVertical: 5,
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.DARK_GRAY,
  },
  text: {
    marginTop: 5,
    fontSize: FONT_SIZES.TINIEST,
    color: COLORS.DARK_GRAY,
  },
})

export default Tabs
