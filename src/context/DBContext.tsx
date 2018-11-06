import React from 'react'
import { createConnection } from 'typeorm/browser'
import { Loader } from '../components'
import { Account, AccountTransaction, Budget } from '../entities'
import { BudgetTransaction } from '../entities/BudgetTransaction'

type Props = {}

type State = {
  isLoadingDB: boolean
}

export interface DBContext extends State {}

const { Consumer, Provider } = React.createContext<DBContext>(null)

export class DBProvider extends React.Component<Props, State> {
  state: State = {
    isLoadingDB: true,
  }

  async componentDidMount() {
    try {
      await createConnection({
        type: 'react-native',
        database: 'pabudget17',
        location: 'default',
        logging: ['query', 'warn', 'error'],
        entities: [Budget, Account, AccountTransaction, BudgetTransaction],
        synchronize: true,
      })
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isLoadingDB: false })
    }
  }

  render() {
    const value: DBContext = { ...this.state }

    return (
      <Provider value={value}>
        <Loader active={this.state.isLoadingDB} text="Loading data..." />
        {!this.state.isLoadingDB && this.props.children}
      </Provider>
    )
  }
}

export const withDB = <Props extends {}>(
  Component: React.ComponentType<Props & { dbContext?: DBContext }>
) => (props: Props) => (
  <Consumer>
    {(dbContext?: DBContext) => <Component {...props} dbContext={dbContext} />}
  </Consumer>
)
