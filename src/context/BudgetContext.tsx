import React from 'react'
import { getRepository } from 'typeorm/browser'
import { Budget } from '../entities'
import { isSame } from '../utils'

type Props = {}

type State = {
  isFetchingBudgets: boolean
  isAddingBudget: boolean
  isUpdatingBudget: boolean
  isDeletingBudget: boolean
  budgets: Budget[]
  totalBudget: number
  totalAvailable: number
  availablePerBudget: Map<number, number>
}

export interface BudgetContext extends State {
  fetchBudgets: () => void
  updateBudget: (newBudget: Budget) => void
  addBudget: (name: string, amount: number) => void
  deleteBudget: (targetBudget: Budget) => void
  arrangeBudgets: (e: { to: number; from: number }) => void
}

const { Consumer, Provider } = React.createContext<BudgetContext>(null)

export class BudgetProvider extends React.Component<Props, State> {
  state: State = {
    budgets: [],
    isFetchingBudgets: true,
    isAddingBudget: false,
    isUpdatingBudget: false,
    isDeletingBudget: false,
    totalBudget: 0,
    totalAvailable: 0,
    availablePerBudget: new Map(),
  }

  async componentDidMount() {
    await this.fetchBudgets()
  }

  componentDidUpdate(prevProps, prevState: State) {
    if (!isSame(prevState.budgets, this.state.budgets)) {
      this.computeTotals()
    }
  }

  computeTotals = () => {
    let totalBudget = 0
    let totalUsed = 0
    const availablePerBudget = new Map()
    for (const budget of this.state.budgets) {
      totalBudget += budget.amount
      availablePerBudget.set(budget.id, budget.amount)
      for (const transaction of budget.transactionsFromAccounts) {
        availablePerBudget.set(
          budget.id,
          availablePerBudget.get(budget.id) - transaction.amount
        )
        totalUsed += transaction.amount
      }
    }
    const totalAvailable = totalBudget - totalUsed
    this.setState({
      totalBudget,
      totalAvailable,
      availablePerBudget,
    })
  }

  fetchBudgets = async () => {
    this.setState({ isFetchingBudgets: true })
    try {
      const budgets = await getRepository(Budget)
        .createQueryBuilder('budget')
        .leftJoinAndSelect(
          'budget.transactionsFromAccounts',
          'transactionsFromAccounts',
          'transactionsFromAccounts.active = :active',
          { active: true }
        )
        .leftJoinAndSelect(
          'transactionsFromAccounts.fromAccount',
          'fromAccount'
        )
        .orderBy('budget.order')
        .getMany()
      this.setState({ budgets })
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isFetchingBudgets: false })
    }
  }

  addBudget = async (name: string, amount: number) => {
    this.setState({ isAddingBudget: true })
    try {
      const budgetRepository = getRepository(Budget)
      const newBudget = new Budget()
      newBudget.name = name
      newBudget.amount = amount
      newBudget.order = this.state.budgets.length

      await budgetRepository.save(newBudget)

      await this.fetchBudgets()
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isAddingBudget: false })
    }
  }

  updateBudget = async (newBudget: Budget) => {
    this.setState({ isUpdatingBudget: true })
    try {
      const budgetRepository = getRepository(Budget)
      await budgetRepository.save(newBudget)
      this.setState({
        budgets: this.state.budgets.map(budget =>
          budget.id === newBudget.id ? newBudget : budget
        ),
      })
      this.fetchBudgets()
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isUpdatingBudget: false })
    }
  }

  deleteBudget = async (targetBudget: Budget) => {
    this.setState({ isDeletingBudget: true })
    try {
      const budgetRepository = getRepository(Budget)

      const budgets = this.state.budgets
        .filter(budget => budget.id !== targetBudget.id)
        .map(budget => {
          if (budget.order > targetBudget.order) budget.order--
          return budget
        })

      await Promise.all(budgets.map(budget => budgetRepository.save(budget)))
      await budgetRepository.delete(targetBudget)
      await this.fetchBudgets()
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isDeletingBudget: false })
    }
  }

  arrangeBudgets = async (e: { to: number; from: number }) => {
    const { to, from } = e

    const newBudgets = this.state.budgets.slice(0)

    newBudgets[from].order = to
    if (to < from) {
      for (let index = to; index < from; index++) {
        newBudgets[index].order++
      }
    } else {
      for (let index = to; index > from; index--) {
        newBudgets[index].order--
      }
    }
    const budgets = newBudgets.sort((a, b) => a.order - b.order)
    this.setState({ budgets })
    const budgetRepository = getRepository(Budget)
    await budgetRepository.save(budgets)
  }

  render() {
    const value: BudgetContext = {
      ...this.state,
      fetchBudgets: this.fetchBudgets,
      updateBudget: this.updateBudget,
      addBudget: this.addBudget,
      deleteBudget: this.deleteBudget,
      arrangeBudgets: this.arrangeBudgets,
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
