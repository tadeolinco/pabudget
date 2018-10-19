import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS, FONT_SIZES } from '../utils'
import Color from 'color'

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
        <View style={[styles.tabItem]} key={index}>
          <TouchableOpacity
            disabled={item.disabled}
            onPress={item.onPress}
            style={styles.touchable}
          >
            <Icon
              name={item.icon}
              style={[
                styles.icon,
                { color: item.disabled ? COLORS.GRAY : COLORS.WHITE },
              ]}
            />
            <Text
              style={[
                styles.text,
                { color: item.disabled ? COLORS.GRAY : COLORS.WHITE },
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.BLACK,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: FONT_SIZES.REGULAR,
  },
  text: {
    marginTop: 5,
    fontSize: FONT_SIZES.TINIEST,
  },
})

export default Tabs
