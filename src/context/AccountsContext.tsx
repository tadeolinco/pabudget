import React from 'react'
import { Account, AccountTransaction } from '../entities'
import { getRepository } from 'typeorm/browser'
import { isSame } from '../utils'

type Props = {}

type State = {
  isAddingAccount: boolean
  isFetchingAccounts: boolean
  accounts: Account[]
  netWorth: number
  totalAssets: number
  totalLiabilities: number
  amountPerAccount: Map<number, number>
}

export interface AccountsContext extends State {
  addAccount: (name: string, initialAmount: number) => void
  fetchAccounts: () => void
  arrangeAccounts: (e: { to: number; from: number }) => void
}

const { Consumer, Provider } = React.createContext<AccountsContext>(null)

export class AccountsProvider extends React.Component<Props, State> {
  state: State = {
    isAddingAccount: false,
    isFetchingAccounts: false,
    accounts: [],
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    amountPerAccount: new Map(),
  }

  async componentDidMount() {
    await this.fetchAccounts()
  }

  async componentDidUpdate(prevProps, prevState: State) {
    if (!isSame(prevState.accounts, this.state.accounts)) {
      this.computeTotals()
    }
  }

  computeTotals = () => {
    let totalAssets = 0
    let totalLiabilities = 0
    const amountPerAccount = new Map()

    for (const account of this.state.accounts) {
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

    this.setState({
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets + totalLiabilities,
      amountPerAccount,
    })
  }

  fetchAccounts = async () => {
    this.setState({ isFetchingAccounts: true })

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
      console.log(accounts)
      this.setState({ accounts })
    } catch (err) {
      console.warn(err)
    }
    this.setState({ isFetchingAccounts: false })
  }

  addAccount = async (name: string, initialAmount: number) => {
    this.setState({ isAddingAccount: true })
    try {
      const accountRepository = getRepository(Account)
      const newAccount = new Account()
      newAccount.name = name
      console.log(this.state.accounts.length)
      newAccount.order = this.state.accounts.length
      await accountRepository.save(newAccount)

      const accountTransactionRepository = getRepository(AccountTransaction)
      const newTransaction = new AccountTransaction()
      newTransaction.amount = initialAmount
      newTransaction.note = 'Initial amount'
      newTransaction.toAccount = newAccount
      newTransaction.fromAccount = null

      await accountTransactionRepository.save(newTransaction)
    } catch (err) {
      console.warn(err)
    }
    this.setState({ isAddingAccount: false })
    await this.fetchAccounts()
  }

  arrangeAccounts = async (e: { to: number; from: number }) => {
    const { to, from } = e

    const newAccounts = this.state.accounts.slice(0)

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

    this.setState({ accounts })
    const accountRepository = getRepository(Account)
    await accountRepository.save(accounts)
  }

  render() {
    const value: AccountsContext = {
      ...this.state,
      addAccount: this.addAccount,
      fetchAccounts: this.fetchAccounts,
      arrangeAccounts: this.arrangeAccounts,
    }

    return <Provider value={value}>{this.props.children}</Provider>
  }
}

export const withAccounts = <Props extends {}>(
  Component: React.ComponentType<Props & { accountsContext?: AccountsContext }>
) => (props: Props) => (
  <Consumer>
    {(accountsContext?: AccountsContext) => (
      <Component {...props} accountsContext={accountsContext} />
    )}
  </Consumer>
)
