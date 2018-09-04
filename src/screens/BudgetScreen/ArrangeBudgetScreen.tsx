import faker from 'faker'
import React, { Fragment } from 'react'
import { TouchableOpacity } from 'react-native'
import SortableListView from 'react-native-sortable-listview'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp } from 'react-navigation'
import { ArrangeBudgetGroup, Header } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { BudgetGroup } from '../../entities'
import { COLORS, FONT_SIZES, range } from '../../utils'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {
  groups: any
}

class AddBudgetScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const groups = []
    const length = range(5, 10)
    for (let i = 0; i < length; ++i) {
      groups.push({
        name: faker.commerce.product(),
        id: i,
        order: i,
      })
    }

    this.state = { groups }
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
        <Header
          title="Add Budget"
          hasBack
          right={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddBudget')
              }}
            >
              <Icon name="plus" color="white" size={FONT_SIZES.LARGE} />
            </TouchableOpacity>
          }
        />
        <SortableListView
          moveOnPressIn
          activeOpacity={0.5}
          style={{ flex: 1, backgroundColor: 'white' }}
          data={groups}
          order={order}
          renderRow={(row: BudgetGroup) => (
            <ArrangeBudgetGroup
              data={row}
              last={row.order === this.state.groups.length - 1}
            />
          )}
          onRowMoved={this.handleRowMoved}
          sortRowStyle={{ backgroundColor: COLORS.GRAY }}
        />
      </Fragment>
    )
  }
}

export default withBudget(AddBudgetScreen)
