import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import NativeModal from 'react-native-modal'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  title: string
  isVisibile: boolean
  onClose?: () => void
  children: JSX.Element[] | JSX.Element
  dimmerClose?: boolean
}

const Modal = ({
  isVisibile,
  onClose,
  title,
  children,
  dimmerClose = false,
}: Props) => {
  return (
    <NativeModal
      onBackdropPress={() => {
        if (dimmerClose) onClose()
      }}
      onBackButtonPress={onClose}
      isVisible={isVisibile}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onClose}
          style={{ padding: 10 }}
        >
          <Icon name="close" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>{children}</View>
    </NativeModal>
  )
}

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingLeft: 10,
    backgroundColor: COLORS.BLACK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: FONT_SIZES.TINY,
  },
  closeIcon: {
    color: 'white',
    fontSize: FONT_SIZES.REGULAR,
  },
  body: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
})

export default Modal
