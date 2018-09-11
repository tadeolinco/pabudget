import React, { Fragment } from 'react'
import { StyleSheet, View } from 'react-native'
import SortableListView from 'react-native-sortable-listview'
import { NavigationScreenProp } from 'react-navigation'
import { ArrangeBudgetGroup, Header, Tabs } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { BudgetGroup } from '../../entities'
import { COLORS, FONT_SIZES } from '../../utils'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {}

class AddBudgetScreen extends React.Component<Props, State> {
  tabItems = [
    {
      text: 'Delete',
      icon: 'trash-alt',
      onPress: () => {},
    },
    {
      text: 'New Group',
      icon: 'plus-circle',
      onPress: () => {
        this.props.navigation.navigate('NewBudget')
      },
    },
  ]

  render() {
    const { groups, arrangeBudgetGroups } = this.props.budgetContext
    const sortedGroups = groups.reduce((acc, curr) => {
      acc[curr.order] = curr
      return acc
    }, {})

    const order = Object.keys(sortedGroups)
      .map(key => sortedGroups[key].order)
      .sort((a, b) => a - b)

    return (
      <Fragment>
        <Header title="Arrange Budget" hasBack />
        <View style={styles.container}>
          <SortableListView
            moveOnPressIn
            activeOpacity={0.5}
            data={sortedGroups}
            order={order}
            renderRow={(row: BudgetGroup) => (
              <ArrangeBudgetGroup
                data={row}
                last={row.order === groups.length - 1}
              />
            )}
            onRowMoved={arrangeBudgetGroups}
            sortRowStyle={{ backgroundColor: COLORS.GRAY }}
          />
        </View>
        <Tabs items={this.tabItems} />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  label: {
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: 10,
  },
})

export default withBudget(AddBudgetScreen)
