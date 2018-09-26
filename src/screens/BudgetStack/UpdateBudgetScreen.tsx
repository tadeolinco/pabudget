import React, { Component, Fragment } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Header, Input } from '../../components'
import { BudgetGroup } from '../../entities'
import { COLORS, FONT_SIZES } from '../../utils'

type Props = {
  navigation: NavigationScreenProp<any>
}

type State = {
  group: BudgetGroup
}

class UpdateBudgetScreen extends Component<Props, State> {
  state: State = {
    group: this.props.navigation.getParam('group'),
  }

  handleChangeGroupName = text => {
    this.setState({ group: { ...this.state.group, name: text } })
  }

  render() {
    const { name, items } = this.state.group

    return (
      <Fragment>
        <Header title="Update Budget Group" hasBack />
        <View style={styles.container}>
          <Text style={styles.label}>Group Name</Text>
          <View style={styles.itemContainer}>
            <Input
              placeholder="Group Name"
              style={styles.input}
              value={name}
              onChangeText={this.handleChangeGroupName}
            />
          </View>
          <Text style={styles.label}>Items</Text>
          {items.map((item, index) => (
            <View style={styles.itemContainer} key={item.id}>
              <Input
                placeholder={`Item ${index + 1}`}
                style={styles.input}
                value={item.name}
                onChangeText={this.handleChangeGroupName}
              />
            </View>
          ))}
        </View>
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  label: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.BLACK,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
})

export default UpdateBudgetScreen
