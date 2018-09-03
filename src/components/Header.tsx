import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { COLORS, FONT_SIZES } from '../utils';

type Props = {
  title: string;
  right?: React.ReactNode;
  hasBack?: boolean;
  navigation?: NavigationScreenProp<any>;
};

const Header = ({ title, right, hasBack = false, navigation }: Props) => {
  return (
    <View style={styles.container}>
      {hasBack && (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ marginRight: 20 }}
        >
          <Icon name="arrow-left" color="white" size={FONT_SIZES.LARGE} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
};

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
});

export default withNavigation(Header);
