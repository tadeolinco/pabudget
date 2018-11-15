import { getRepository } from 'typeorm/browser'
import { Budget } from '../entities'

export const budget = {
  state: {
    budgets: [],
    isFetchingBudgets: true,
    isAddingBudget: false,
    isUpdatingBudget: false,
    isDeletingBudget: false,
    totalBudget: 0,
    totalAvailable: 0,
    availablePerBudget: new Map(),
  },

  selectors: {},

  reducers: {
    fetchBudgetsStart(state) {
      return { ...state, isFetchingBudgets: true }
    },
    fetchBudgetsSuccess(state, payload) {
      return { ...state, isFetchingBudgets: false, budgets: payload }
    },
    fetchBudgetsFailure(state) {
      return { ...state, isFetchingBudgets: false }
    },
    addBudgetStart(state) {
      return { ...state, isAddingBudget: true }
    },
    addBudgetSuccess(state, payload) {
      return {
        ...state,
        isAddingBudget: false,
        budgets: [...state.budgets, payload],
      }
    },
    addBudgetFailure(state) {
      return { ...state, isAddingBudget: false }
    },
    updateBudgetStart(state) {
      return { ...state, isUpdatingBudget: true }
    },
    updateBudgetSuccess(state, payload) {
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
    deleteBudgetSuccess(state, payload) {
      return {
        ...state,
        isDeletingBudget: false,
        budgets: payload,
      }
    },
    deleteBudgetFailure(state) {
      return { ...state, isDeletingBudget: false }
    },
  },
  effects: dispatch => ({
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
        dispatch.budget.fetchBudgetsFailure()
      }
    },

    async addBudget(payload, state) {
      const { name, amount } = payload
      dispatch.budget.addBudgetStart()
      try {
        const budgetRepository = getRepository(Budget)
        const newBudget = new Budget()
        newBudget.name = name
        newBudget.amount = amount
        newBudget.order = state.budgets.length

        await budgetRepository.save(newBudget)

        dispatch.budget.addBudgetSuccess(newBudget)
      } catch (err) {
        dispatch.budget.addBudgetFailure()
      }
    },

    async updateBudget(payload, state) {
      dispatch.budget.updateBudgetStart()
      try {
        const budgetRepository = getRepository(Budget)
        await budgetRepository.save(payload)

        dispatch.budget.updateBudgetSuccess(payload)
      } catch (err) {
        dispatch.budget.updateBudgetFailure()
      }
    },

    async deleteBudget(payload, state) {
      dispatch.budget.deleteBudgetStart()
      try {
        const budgetRepository = getRepository(Budget)

        const budgets = state.budgets
          .filter(budget => budget.id !== payload.id)
          .map(budget => {
            if (budget.order > payload.order) budget.order--
            return budget
          })

        await Promise.all(budgets.map(budget => budgetRepository.save(budget)))
        await budgetRepository.delete(payload)

        dispatch.budget.deleteBudgetSuccess(budgets)
      } catch (err) {
        dispatch.budget.deleteBudgetFailure()
      }
    },
  }),
}
