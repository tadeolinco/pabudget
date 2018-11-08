import React from 'react'
import { Account, AccountTransaction } from '../entities'
import { getRepository, Repository } from 'typeorm/browser'
import { isSame } from '../utils'

type Props = {}

type State = {
  isAddingAccount: boolean
  isFetchingAccounts: boolean
  isDeletingAccount: boolean
  isUpdatingAccount: boolean
  accounts: Account[]
  netWorth: number
  totalAssets: number
  totalLiabilities: number
  amountPerAccount: Map<number, number>
}

export interface AccountsContext extends State {
  addAccount: (name: string, initialAmount: number) => void
  fetchAccounts: () => void
  deleteAccount: (targetAccount: Account) => void
  updateAccount: (newAccount: Account) => void
  arrangeAccounts: (e: { to: number; from: number }) => void
}

const { Consumer, Provider } = React.createContext<AccountsContext>(null)

export class AccountsProvider extends React.Component<Props, State> {
  state: State = {
    isAddingAccount: false,
    isFetchingAccounts: true,
    isDeletingAccount: false,
    isUpdatingAccount: false,
    accounts: [],
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    amountPerAccount: new Map(),
  }

  accountRepository: Repository<Account> = getRepository(Account)

  constructor(props) {
    super(props)
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
      const accounts = await this.accountRepository.find({
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
      const newAccount = new Account()
      newAccount.name = name
      console.log(this.state.accounts.length)
      newAccount.order = this.state.accounts.length
      await this.accountRepository.save(newAccount)

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

  updateAccount = async (newAccount: Account) => {
    this.setState({ isUpdatingAccount: true })
    try {
      await this.accountRepository.save(newAccount)
      this.setState({
        accounts: this.state.accounts.map(account =>
          account.id === newAccount.id ? newAccount : account
        ),
      })
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isUpdatingAccount: false })
    }
  }

  deleteAccount = async (targetAccount: Account) => {
    this.setState({ isDeletingAccount: true })
    try {
      const accounts = this.state.accounts
        .filter(account => account.id !== targetAccount.id)
        .map(account => {
          if (account.order > targetAccount.order) account.order--
          return account
        })

      await Promise.all(
        accounts.map(budget => this.accountRepository.save(budget))
      )
      await this.accountRepository.delete(targetAccount)
      await this.fetchAccounts()
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isDeletingAccount: false })
    }
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
    await this.accountRepository.save(accounts)
  }

  render() {
    const value: AccountsContext = {
      ...this.state,
      addAccount: this.addAccount,
      fetchAccounts: this.fetchAccounts,
      arrangeAccounts: this.arrangeAccounts,
      deleteAccount: this.deleteAccount,
      updateAccount: this.updateAccount,
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
