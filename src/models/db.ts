import { createConnection } from 'typeorm/browser'
import {
  Budget,
  Account,
  AccountTransaction,
  BudgetTransaction,
} from '../entities'

export const db = {
  state: {
    isLoadingDB: true,
  },
  selectors: {},
  reducers: {
    loadDBSuccess: state => {
      return { ...state, isLoadingDB: false }
    },
  },
  effects: dispatch => ({
    async loadDB() {
      await createConnection({
        type: 'react-native',
        database: 'pabudget17',
        location: 'default',
        // logging: ['query', 'warn', 'error'],
        entities: [Budget, Account, AccountTransaction, BudgetTransaction],
        synchronize: true,
      })
      dispatch.db.loadDBSuccess()
    },
  }),
}
