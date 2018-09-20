import React from 'react'
import { createConnection } from 'typeorm/browser'
import { Loader } from '../components'
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
  state: State = {
    isLoadingDB: true,
  }

  async componentDidMount() {
    try {
      await createConnection({
        type: 'react-native',
        database: 'pabudget3',
        location: 'default',
        logging: ['error', 'query', 'schema'],
        entities: [BudgetGroup, BudgetItem, Account, AccountTransaction],
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
        <Loader active={this.state.isLoadingDB} />
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
