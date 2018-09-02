import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils';

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

const Header = ({ title, right }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
