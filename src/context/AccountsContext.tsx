import React from 'react'
import { Account } from '../entities'
import { getRepository } from 'typeorm/browser'

type Props = {}

type State = {
  isFetchingAccounts: boolean
  accounts: Account[]
  netWorth: number
  totalAssets: number
  totalDebts: number
}

export interface AccountsContext extends State {}

const { Consumer, Provider } = React.createContext<AccountsContext>(null)

export class AccountsProvider extends React.Component<Props, State> {
  state: State = {
    isFetchingAccounts: true,
    accounts: [],
    netWorth: 0,
    totalAssets: 0,
    totalDebts: 0,
  }

  async componentDidMount() {
    await this.fetchAccounts()
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      JSON.stringify(prevState.accounts) !== JSON.stringify(this.state.accounts)
    ) {
      this.computeTotals()
    }
  }

  computeTotals = () => {
    let totalAssets = 0
    let totalDebts = 0

    for (const account of this.state.accounts) {
      for (const transaction of account.transactions) {
        if (transaction.amount < 0) {
          totalDebts -= transaction.amount
        } else {
          totalAssets += transaction.amount
        }
      }
    }

    this.setState({
      totalAssets,
      totalDebts,
      netWorth: totalAssets - totalDebts,
    })
  }

  fetchAccounts = async () => {
    this.setState({ isFetchingAccounts: true })

    try {
      const accounts = await getRepository(Account).find({
        relations: ['transactions'],
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

  render() {
    const value: AccountsContext = {
      ...this.state,
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
