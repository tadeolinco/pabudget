import React, { Fragment } from 'react'
import SortableListView from 'react-native-sortable-listview'
import { NavigationScreenProp } from 'react-navigation'
import { AddBudgetGroup, Header } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { BudgetGroup } from '../../entities'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {
  groups: any
}

class AddBudgetScreen extends React.Component<Props, State> {
  state = {
    groups: [
      { name: '0', id: 0, order: 0 },
      { name: '1', id: 1, order: 1 },
      { name: '2', id: 2, order: 2 },
      { name: '3', id: 3, order: 3 },
      { name: '4', id: 4, order: 4 },
      { name: '5', id: 5, order: 5 },
      { name: '6', id: 6, order: 6 },
    ],
  }

  handleRowMoved = (e: { to: number; from: number }) => {
    const { to, from } = e

    const newGroups = [...this.state.groups]
    newGroups[from].order = to
    if (to < from) {
      for (let index = to; index < from; index++) {
        newGroups[index].order++
      }
    } else {
      for (let index = to; index > from; index--) {
        newGroups[index].order--
      }
    }
    this.setState({
      groups: newGroups.sort((a, b) => a.order - b.order),
    })
  }

  render() {
    // const { groups } = this.props.budgetContext
    const groups = this.state.groups.reduce((acc, curr) => {
      acc[curr.order] = curr
      return acc
    }, {})

    const order = Object.keys(groups)
      .map(key => groups[key].order)
      .sort((a, b) => a - b)

    return (
      <Fragment>
        <Header title="Add Budget" hasBack />
        <SortableListView
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: 'white' }}
          data={groups}
          order={order}
          renderRow={(row: BudgetGroup) => <AddBudgetGroup data={row} />}
          onRowMoved={this.handleRowMoved}
        />
      </Fragment>
    )
  }
}

export default withBudget(AddBudgetScreen)
