import React from 'react'
import { Platform, StatusBar as NativeStatusBar, View } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { COLORS } from '../utils'

const height =
  Platform.OS === 'ios'
    ? isIphoneX()
      ? 44
      : 20
    : NativeStatusBar.currentHeight

const StatusBar = () => (
  <View style={{ height, backgroundColor: COLORS.DARK_BLACK }}>
    <NativeStatusBar
      translucent
      backgroundColor={COLORS.DARK_BLACK}
      barStyle="light-content"
    />
  </View>
)

export default StatusBar
