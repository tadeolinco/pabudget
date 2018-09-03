import React, { Fragment } from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Header } from '../../components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {};

class AddBudgetScreen extends React.Component<Props, State> {
  render() {
    return (
      <Fragment>
        <Header title="Add Budget" hasBack />
        <View>
          <Text>Add BudgetSreen</Text>
        </View>
      </Fragment>
    );
  }
}

export default AddBudgetScreen;
