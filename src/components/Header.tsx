import React, { Fragment } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import { COLORS, FONT_SIZES } from '../utils'
import StatusBar from './StatusBar'

type Props = {
  title: string
  right?: React.ReactNode
  hasBack?: boolean
  navigation?: NavigationScreenProp<any>
}

const Header = ({ title, right, hasBack = false, navigation }: Props) => {
  return (
    <Fragment>
      <StatusBar />
      <View style={styles.container}>
        {hasBack && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            style={{ marginRight: 20 }}
          >
            <Icon name="arrow-left" color="white" size={FONT_SIZES.LARGE} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {right}
      </View>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: COLORS.BLACK,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.LARGE,
  },
})

export default withNavigation(Header)
