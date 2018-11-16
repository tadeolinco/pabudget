import { getRepository } from 'typeorm/browser'
import { Budget } from '../entities'

const state = {
  budgets: [],
  isFetchingBudgets: true,
  isAddingBudget: false,
  isUpdatingBudget: false,
  isDeletingBudget: false,
}

const selectors = slice => ({
  computeTotals() {
    return slice(state => {
      let totalBudget = 0
      let totalUsed = 0
      const availablePerBudget = new Map()
      for (const budget of state.budgets) {
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
      return {
        totalBudget,
        totalAvailable,
        availablePerBudget,
      }
    })
  },
})

const reducers = {
  fetchBudgetsStart(state) {
    return { ...state, isFetchingBudgets: true }
  },
  fetchBudgetsSuccess(state, payload: Budget[]) {
    return { ...state, isFetchingBudgets: false, budgets: payload }
  },
  fetchBudgetsFailure(state) {
    return { ...state, isFetchingBudgets: false }
  },
  addBudgetStart(state) {
    return { ...state, isAddingBudget: true }
  },
  addBudgetSuccess(state) {
    return {
      ...state,
      isAddingBudget: false,
    }
  },
  addBudgetFailure(state) {
    return { ...state, isAddingBudget: false }
  },
  updateBudgetStart(state) {
    return { ...state, isUpdatingBudget: true }
  },
  updateBudgetSuccess(state, payload: Budget) {
    return {
      ...state,
      isUpdatingBudget: false,
      budgets: state.budgets.map(budget =>
        budget.id === payload.id ? payload : budget
      ),
    }
  },
  updateBudgetFailure(state) {
    return { ...state, isUpdatingBudget: false }
  },

  deleteBudgetStart(state) {
    return { ...state, isDeletingBudget: true }
  },
  deleteBudgetSuccess(state, payload: Budget[]) {
    return {
      ...state,
      isDeletingBudget: false,
      budgets: payload,
    }
  },
  deleteBudgetFailure(state) {
    return { ...state, isDeletingBudget: false }
  },
}

const effects = dispatch => ({
  async fetchBudgets() {
    dispatch.budget.fetchBudgetsStart()
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

      dispatch.budget.fetchBudgetsSuccess(budgets)
    } catch (err) {
      console.warn(err)
      dispatch.budget.fetchBudgetsFailure()
    }
  },

  async addBudget(payload: { name: string; amount: number }, state) {
    const { name, amount } = payload
    dispatch.budget.addBudgetStart()
    try {
      const budgetRepository = getRepository(Budget)
      const newBudget = new Budget()
      newBudget.name = name
      newBudget.amount = amount
      newBudget.order = state.budget.budgets.length

      await budgetRepository.save(newBudget)

      const budget = await budgetRepository.findOne(newBudget.id)

      dispatch.budget.addBudgetSuccess()
      dispatch.budget.fetchBudgets()
    } catch (err) {
      console.log(err)
      dispatch.budget.addBudgetFailure()
    }
  },

  async updateBudget(payload: Budget, state) {
    dispatch.budget.updateBudgetStart()
    try {
      const budgetRepository = getRepository(Budget)
      await budgetRepository.save(payload)

      dispatch.budget.updateBudgetSuccess(payload)
    } catch (err) {
      console.warn(err)
      dispatch.budget.updateBudgetFailure()
    }
  },

  async deleteBudget(payload: Budget, state) {
    dispatch.budget.deleteBudgetStart()
    try {
      const budgetRepository = getRepository(Budget)

      const budgets = state.budget.budgets
        .filter(budget => budget.id !== payload.id)
        .map(budget => {
          if (budget.order > payload.order) budget.order--
          return budget
        })

      await Promise.all(budgets.map(budget => budgetRepository.save(budget)))
      await budgetRepository.delete(payload)

      dispatch.budget.deleteBudgetSuccess(budgets)
    } catch (err) {
      console.warn(err)
      dispatch.budget.deleteBudgetFailure()
    }
  },

  async arrangeBudgets(payload: { to: number; from: number }, state) {
    const { to, from } = payload
    const newBudgets = state.budget.budgets.slice(0)

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

    try {
      await getRepository(Budget).save(budgets)
    } catch (err) {
      console.warn(err)
    }
    dispatch.budget.fetchBudgets()
  },
})

export const budget = { state, selectors, reducers, effects }
