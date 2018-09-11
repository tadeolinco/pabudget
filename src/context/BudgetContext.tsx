import React from 'react'
import { getRepository } from 'typeorm/browser'
import { BudgetGroup, BudgetItem } from '../entities'

type Props = {}

type State = {
  groups: BudgetGroup[]
}

export interface BudgetContext extends State {
  fetchBudgetGroups: () => void
  arrangeBudgetGroups: (e: { to: number; from: number }) => void
  updateBudget: (budgetItem: BudgetItem) => void
}

const { Consumer, Provider } = React.createContext<BudgetContext>(null)

export class BudgetProvider extends React.Component<Props, State> {
  state: State = { groups: [] }

  async componentDidMount() {
    await this.fetchBudgetGroups()
  }

  fetchBudgetGroups = async () => {
    const groups = await getRepository(BudgetGroup).find({
      relations: ['items', 'items.transactions'],
    })
    this.setState({ groups })
  }

  arrangeBudgetGroups = (e: { to: number; from: number }) => {
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

  updateBudget = async (budgetItem: BudgetItem) => {
    try {
      const budgetItemRepository = getRepository(BudgetItem)

      const item = await budgetItemRepository.findOne(budgetItem.id)
      item.budget = budgetItem.budget
      await getRepository(BudgetItem).save(item)

      const { id, groupId, budget } = budgetItem
      this.setState({
        groups: this.state.groups.map(group => {
          if (group.id === groupId) {
            group.items = group.items.map(item => {
              if (item.id === id) item.budget = budget
              return item
            })
          }
          return group
        }),
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const value: BudgetContext = {
      ...this.state,
      fetchBudgetGroups: this.fetchBudgetGroups,
      arrangeBudgetGroups: this.arrangeBudgetGroups,
      updateBudget: this.updateBudget,
    }

    return <Provider value={value}>{this.props.children}</Provider>
  }
}

export const withBudget = <Props extends {}>(
  Component: React.ComponentType<Props & { budgetContext?: BudgetContext }>
) => (props: Props) => (
  <Consumer>
    {(budgetContext?: BudgetContext) => (
      <Component {...props} budgetContext={budgetContext} />
    )}
  </Consumer>
)
