import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils';

type Props = {
  title: string;
  right?: React.ReactNode;
};

const Header = ({ title, right }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.BLACK,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.HUGE,
  },
});

export default Header;
