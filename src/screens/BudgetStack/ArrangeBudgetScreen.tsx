import React, { Fragment } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SortableListView from 'react-native-sortable-listview'
import { NavigationScreenProp } from 'react-navigation'
import { Header, Loader, Tabs } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { BudgetGroup } from '../../entities'
import { COLORS, FONT_SIZES } from '../../utils'
import { ArrangeBudgetGroup } from './components'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {
  selectedGroups: Set<number>
}

class AddBudgetScreen extends React.Component<Props, State> {
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  state: State = {
    selectedGroups: new Set(),
  }

  selectGroup = (id: number) => {
    if (this.state.selectedGroups.has(id)) {
      this.state.selectedGroups.delete(id)
    } else {
      this.state.selectedGroups.add(id)
    }

    this.setState({ selectedGroups: this.state.selectedGroups })
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

    const sortedGroups = this.props.budgetContext.groups.reduce((acc, curr) => {
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
          {this.props.budgetContext.groups.length ? (
            <SortableListView
              moveOnPressIn
              activeOpacity={0.5}
              data={sortedGroups}
              order={order}
              renderRow={(row: BudgetGroup) => (
                <ArrangeBudgetGroup
                  data={row}
                  selected={this.state.selectedGroups.has(row.id)}
                  handleSelect={this.selectGroup}
                />
              )}
              rowHasChanged={a => {
                return true
              }}
              onRowMoved={this.props.budgetContext.arrangeBudgetGroups}
              sortRowStyle={{ backgroundColor: COLORS.GRAY }}
            />
          ) : (
            <View style={[styles.container, styles.center]}>
              <Text style={styles.text}>No budget groups to arrange.</Text>
            </View>
          )}
        </View>
        <Tabs items={tabItems} />
        <Loader
          active={this.props.budgetContext.isDeletingGroups}
          text="Deleting group..."
        />
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
