import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import NativeModal from 'react-native-modal'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLORS, FONT_SIZES } from '../utils'

type Props = {
  title: string
  isVisibile: boolean
  onClose?: () => void
  children: JSX.Element
}

const Modal = ({ isVisibile, onClose, title, children }: Props) => {
  return (
    <NativeModal isVisible={isVisibile}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose}>
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
    padding: 10,
    backgroundColor: COLORS.BLACK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: FONT_SIZES.REGULAR,
  },
  closeIcon: {
    color: 'white',
    fontSize: FONT_SIZES.LARGE,
  },
  body: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
})

export default Modal
