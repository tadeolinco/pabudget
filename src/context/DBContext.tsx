import React from 'react'
import { createConnection } from 'typeorm/browser'
import {
  Account,
  AccountTransaction,
  BudgetGroup,
  BudgetItem,
} from '../entities'

type Props = {}

type State = {
  isLoadingDB: boolean
}

export interface DBContext extends State {}

const { Consumer, Provider } = React.createContext<DBContext>(null)

export class DBProvider extends React.Component<Props, State> {
  state = {
    isLoadingDB: true,
  }

  async componentDidMount() {
    try {
      await createConnection({
        type: 'react-native',
        database: 'pabudget2',
        location: 'default',
        logging: ['error', 'query', 'schema'],
        entities: [BudgetGroup, BudgetItem, Account, AccountTransaction],
        synchronize: true,
      })
    } catch (err) {
      console.log({ err })
    } finally {
      this.setState({ isLoadingDB: false })
    }
  }

  render() {
    const value: DBContext = { ...this.state }

    return (
      <Provider value={value}>
        {!this.state.isLoadingDB && this.props.children}
      </Provider>
    )
  }
}

export const withDB = <Props extends {}>(
  Component: React.ComponentType<Props & { dbContext: DBContext }>
) => (props: Props) => (
  <Consumer>
    {(dbContext: DBContext) => <Component {...props} dbContext={dbContext} />}
  </Consumer>
)
