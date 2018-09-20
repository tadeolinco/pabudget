import React from 'react'
import { getRepository } from 'typeorm/browser'
import { BudgetGroup, BudgetItem } from '../entities'

type Props = {}

type State = {
  isFetchingGroups: boolean
  isDeletingGroups: boolean
  groups: BudgetGroup[]
}

export interface BudgetContext extends State {
  fetchBudgetGroups: () => void
  deleteBudgetGroups: (ids: number[]) => void
  arrangeBudgetGroups: (e: { to: number; from: number }) => void
  updateBudget: (budgetItem: BudgetItem) => void
}

const { Consumer, Provider } = React.createContext<BudgetContext>(null)

export class BudgetProvider extends React.Component<Props, State> {
  state: State = {
    groups: [],
    isFetchingGroups: true,
    isDeletingGroups: false,
  }

  async componentDidMount() {
    await this.fetchBudgetGroups()
  }

  fetchBudgetGroups = async () => {
    this.setState({ isFetchingGroups: true })
    try {
      const groups = await getRepository(BudgetGroup).find({
        relations: ['items', 'items.transactions'],
        order: {
          order: 'ASC',
        },
      })
      this.setState({ groups })
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isFetchingGroups: false })
    }
  }

  deleteBudgetGroups = async (ids: number[]) => {
    this.setState({ isDeletingGroups: true })
    try {
      const minOrder = (await getRepository(BudgetGroup).findByIds(ids)).reduce(
        (acc, curr) => {
          if (curr.order < acc) {
            return curr.order
          }
          return acc
        },
        Infinity
      )

      const groups = this.state.groups
        .filter(group => !ids.includes(group.id))
        .map(group => {
          if (group.order > minOrder) group.order = group.order - ids.length
          return group
        })

      await Promise.all(
        this.state.groups.map(group => getRepository(BudgetGroup).save(group))
      )

      await getRepository(BudgetGroup).delete(ids)
      this.setState({ groups })
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isDeletingGroups: false })
    }
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
      console.warn(err)
    }
  }

  render() {
    const value: BudgetContext = {
      ...this.state,
      fetchBudgetGroups: this.fetchBudgetGroups,
      deleteBudgetGroups: this.deleteBudgetGroups,
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
