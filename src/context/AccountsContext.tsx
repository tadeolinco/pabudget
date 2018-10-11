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
  totalDebts: number
  amountPerAccount: Map<number, number>
}

export interface AccountsContext extends State {
  addAccount: (name: string, initialValue: number) => void
}

const { Consumer, Provider } = React.createContext<AccountsContext>(null)

export class AccountsProvider extends React.Component<Props, State> {
  state: State = {
    isAddingAccount: false,
    isFetchingAccounts: true,
    accounts: [],
    netWorth: 0,
    totalAssets: 0,
    totalDebts: 0,
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
    let totalDebts = 0
    const amountPerAccount = new Map()

    for (const account of this.state.accounts) {
      amountPerAccount.set(account.id, 0)

      for (const transaction of account.toTransactions) {
        amountPerAccount.set(
          account.id,
          amountPerAccount.get(account.id) + transaction.amount
        )

        if (transaction.amount < 0) {
          totalDebts -= transaction.amount
        } else {
          totalAssets += transaction.amount
        }
      }

      for (const transaction of account.fromTransactions) {
        amountPerAccount.set(
          account.id,
          amountPerAccount.get(account.id) - transaction.amount
        )

        if (transaction.amount < 0) {
          totalDebts += transaction.amount
        } else {
          totalAssets -= transaction.amount
        }
      }
    }

    this.setState({
      totalAssets,
      totalDebts,
      netWorth: totalAssets - totalDebts,
      amountPerAccount,
    })
  }

  fetchAccounts = async () => {
    this.setState({ isFetchingAccounts: true })

    try {
      const accounts = await getRepository(Account).find({
        relations: ['fromTransactions', 'toTransactions'],
        order: {
          name: 'ASC',
        },
      })
      this.setState({ accounts })
    } catch (err) {
      console.warn(err)
    }
    this.setState({ isFetchingAccounts: false })
  }

  addAccount = async (name: string, initialValue: number) => {
    this.setState({ isAddingAccount: true })
    try {
      const accountRepository = getRepository(Account)
      const newAccount = new Account()
      newAccount.name = name
      console.log(newAccount)
      await accountRepository.save(newAccount)

      const transactionRepository = getRepository(AccountTransaction)
      const newTransaction = new AccountTransaction()
      newTransaction.amount = initialValue
      newTransaction.note = 'Initial amount'
      newTransaction.toAccount = newAccount

      await transactionRepository.save(newTransaction)
    } catch (err) {
      console.warn(err)
    }
    this.setState({ isAddingAccount: false })
    await this.fetchAccounts()
  }

  render() {
    const value: AccountsContext = {
      ...this.state,
      addAccount: this.addAccount,
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
