import React from 'react';
import { Text, View } from 'react-native';
import { createConnection } from 'typeorm/browser';
import {
  Account,
  AccountTransaction,
  BudgetGroup,
  BudgetItem,
} from '../entities';

type Props = {};

type State = {
  isLoadingDB: boolean;
};

export interface DBContext extends State {}

const { Consumer, Provider } = React.createContext<DBContext | null>(null);

export class DBProvider extends React.Component<Props, State> {
  state = {
    isLoadingDB: true,
  };

  async componentDidMount() {
    try {
      await createConnection({
        type: 'react-native',
        database: 'pabudget2',
        location: 'default',
        logging: ['error', 'query', 'schema'],
        entities: [BudgetGroup, BudgetItem, Account, AccountTransaction],
        synchronize: true,
      });
    } catch (err) {
      console.log({ err });
    } finally {
      this.setState({ isLoadingDB: false });
    }
  }

  render() {
    const value: DBContext = { ...this.state };

    const loader = (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black', fontSize: 20 }}>Loading...</Text>
      </View>
    );

    return this.state.isLoadingDB ? (
      loader
    ) : (
      <Provider value={value}>{this.props.children}</Provider>
    );
  }
}

export const withDB = <Props extends {}>(
  Component: React.ComponentType<Props & { dbContext: DBContext | null }>
) => (props: Props) => (
  <Consumer>
    {(dbContext: DBContext | null) => (
      <Component {...props} dbContext={dbContext} />
    )}
  </Consumer>
);
