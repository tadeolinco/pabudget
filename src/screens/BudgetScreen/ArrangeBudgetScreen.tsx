import React, { Fragment } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SortableListView from 'react-native-sortable-listview'
import { NavigationScreenProp } from 'react-navigation'
import { ArrangeBudgetGroup, Header, Loader, Tabs } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { BudgetGroup } from '../../entities'
import { COLORS, FONT_SIZES } from '../../utils'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {
  selectedGroups: Set<number>
}

class AddBudgetScreen extends React.Component<Props, State> {
  state: State = {
    selectedGroups: new Set(),
  }

  selectGroup = (id: number) => {
    const { selectedGroups } = this.state

    if (selectedGroups.has(id)) {
      selectedGroups.delete(id)
    } else {
      selectedGroups.add(id)
    }

    this.setState({ selectedGroups })
  }

  onDeleteBudgetGroups = async () => {
    await this.props.budgetContext.deleteBudgetGroups(
      Array.from(this.state.selectedGroups.values())
    )
    this.setState({ selectedGroups: new Set() })
  }

  render() {
    const tabItems = [
      {
        text: 'Delete',
        icon: 'trash-alt',
        onPress: this.onDeleteBudgetGroups,
        disabled: !this.state.selectedGroups.size,
      },
      {
        text: 'New Group',
        icon: 'plus-circle',
        onPress: () => {
          this.props.navigation.navigate('NewBudget')
        },
      },
    ]

    const { selectedGroups } = this.state
    const {
      groups,
      arrangeBudgetGroups,
      isDeletingGroups,
    } = this.props.budgetContext
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
          {groups.length ? (
            <SortableListView
              moveOnPressIn
              activeOpacity={0.5}
              data={sortedGroups}
              order={order}
              renderRow={(row: BudgetGroup) => (
                <ArrangeBudgetGroup
                  data={row}
                  selected={selectedGroups.has(row.id)}
                  handleSelect={this.selectGroup}
                />
              )}
              rowHasChanged={a => {
                return true
              }}
              onRowMoved={arrangeBudgetGroups}
              sortRowStyle={{ backgroundColor: COLORS.GRAY }}
            />
          ) : (
            <View style={[styles.container, styles.center]}>
              <Text style={styles.text}>No budget groups to arrange.</Text>
            </View>
          )}
        </View>
        <Tabs items={tabItems} />
        <Loader active={isDeletingGroups} />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: 10,
  },
  text: {
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZES.TINY,
  },
})

export default withBudget(AddBudgetScreen)
