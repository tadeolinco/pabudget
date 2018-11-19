import { Account } from '../entities/Account'
import { getRepository } from 'typeorm/browser'
import { AccountTransaction } from '../entities'

const state = {
  isAddingAccount: false,
  isFetchingAccounts: true,
  isDeletingAccount: false,
  isUpdatingAccount: false,
  accounts: [],
}

const selectors = slice => ({
  computeTotals() {
    return slice(state => {
      let totalAssets = 0
      let totalLiabilities = 0
      const amountPerAccount = new Map()

      for (const account of state.accounts) {
        amountPerAccount.set(account.id, 0)

        for (const transaction of account.transactionsFromAccounts) {
          amountPerAccount.set(
            account.id,
            amountPerAccount.get(account.id) + transaction.amount
          )
          totalAssets += transaction.amount
        }

        for (const transaction of account.transactionsToAccounts) {
          amountPerAccount.set(
            account.id,
            amountPerAccount.get(account.id) - transaction.amount
          )

          totalLiabilities -= transaction.amount
        }

        for (const transaction of account.transactionsToBudgets) {
          amountPerAccount.set(
            account.id,
            amountPerAccount.get(account.id) - transaction.amount
          )

          totalLiabilities -= transaction.amount
        }
      }

      return {
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets + totalLiabilities,
        amountPerAccount,
      }
    })
  },
})

const reducers = {
  fetchAccountsStart(state) {
    return { ...state, isFetchingAccounts: true }
  },
  fetchAccountsSuccess(state, payload: Account[]) {
    return { ...state, isFetchingAccounts: false, accounts: payload }
  },
  fetchAccountsFailure(state) {
    return { ...state, isFetchingAccounts: false }
  },

  addAccountStart(state) {
    return { ...state, isAddingAccount: true }
  },
  addAccountSuccess(state) {
    return {
      ...state,
      isAddingAccount: false,
    }
  },
  addAccountFailure(state) {
    return { ...state, isAddingAccount: false }
  },

  updateAccountStart(state) {
    return { ...state, isUpdatingAccount: true }
  },
  updateAccountSuccess(state, payload: Account) {
    return {
      ...state,
      isUpdatingAccount: false,
      accounts: state.accounts.map(account =>
        account.id === payload.id ? payload : account
      ),
    }
  },
  updateAccountFailure(state) {
    return { ...state, isUpdatingAccount: false }
  },

  deletingAccountStart(state) {
    return { ...state, isDeletingAccount: true }
  },
  deletingAccountSuccess(state, payload: Account[]) {
    return {
      ...state,
      isDeletingAccount: false,
      accounts: payload,
    }
  },
  deletingAccountFailure(state) {
    return { ...state, isDeletingAccount: false }
  },
}

const effects = dispatch => ({
  async fetchAccounts() {
    dispatch.account.fetchAccountsStart()
    try {
      const accounts = await getRepository(Account).find({
        relations: [
          'transactionsFromAccounts',
          'transactionsFromAccounts.fromAccount',
          'transactionsFromAccounts.toAccount',
          'transactionsToAccounts',
          'transactionsToAccounts.fromAccount',
          'transactionsToAccounts.toAccount',
          'transactionsToBudgets',
          'transactionsToBudgets.fromAccount',
          'transactionsToBudgets.toBudget',
        ],
        order: { order: 'ASC' },
      })
      dispatch.account.fetchAccountsSuccess(accounts)
    } catch (err) {
      console.warn(err)
      dispatch.account.fetchAccountsFailure()
    }
  },

  async addAccount(payload: { name: string; initialAmount: number }, state) {
    const { name, initialAmount } = payload
    dispatch.account.addAccountStart()
    try {
      const newAccount = new Account()
      newAccount.name = name
      newAccount.order = state.account.accounts.length

      await getRepository(Account).save(newAccount)

      const accountTransactionRepository = getRepository(AccountTransaction)
      const newTransaction = new AccountTransaction()
      newTransaction.amount = initialAmount
      newTransaction.note = 'Initial amount'
      newTransaction.toAccount = newAccount
      newTransaction.fromAccount = null

      await accountTransactionRepository.save(newTransaction)

      dispatch.account.addAccountSuccess()
      dispatch.account.fetchAccounts()
    } catch (err) {
      console.warn(err)
      dispatch.account.addAccountFailure()
    }
  },

  async updateAccount(payload: Account) {
    dispatch.account.updateAccountStart()
    try {
      await getRepository(Account).save(payload)

      dispatch.account.updateAccountSuccess(payload)
    } catch (err) {
      console.warn(err)
      dispatch.account.updateAccountFailure()
    }
  },

  async deleteAccount(payload: Account, state) {
    console.log('deleting account')
    dispatch.account.deletingAccountStart()
    try {
      const accountRepository = getRepository(Account)
      const accounts = state.account.accounts
        .filter(account => account.id !== payload.id)
        .map(account => {
          if (account.order > payload.order) account.order--
          return account
        })

      await Promise.all(
        accounts.map(account => accountRepository.save(account))
      )
      await accountRepository.delete(payload)
      dispatch.account.deletingAccountSuccess(accounts)
    } catch (err) {
      console.warn(err)
      dispatch.account.deletingAccountFailure()
    }
  },

  async arrangeAccounts(payload: { to: number; from: number }, state) {
    const { to, from } = payload

    const newAccounts = state.account.accounts.slice(0)

    newAccounts[from].order = to

    if (to < from) {
      for (let index = to; index < from; index++) {
        newAccounts[index].order++
      }
    } else {
      for (let index = to; index > from; index--) {
        newAccounts[index].order--
      }
    }

    const accounts = newAccounts.sort((a, b) => a.order - b.order)

    try {
      await getRepository(Account).save(accounts)
    } catch (err) {
      console.warn(err)
    }
    dispatch.account.fetchAccounts()
  },
})

export const account = { state, selectors, reducers, effects }
