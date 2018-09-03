import React from 'react';
import { getRepository } from 'typeorm/browser';
import { BudgetGroup } from '../entities';

type Props = {};

type State = {
  groups: BudgetGroup[];
};

export interface BudgetContext extends State {}

const { Consumer, Provider } = React.createContext<BudgetContext | null>(null);

export class BudgetProvider extends React.Component<Props, State> {
  state = { groups: [] };

  async componentDidMount() {
    const groups = await getRepository(BudgetGroup).find({
      relations: ['items', 'items.transactions'],
    });
    this.setState({ groups });
  }

  render() {
    const value: BudgetContext = {
      ...this.state,
    };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export const withBudget = <Props extends {}>(
  Component: React.ComponentType<
    Props & { budgetContext: BudgetContext | null }
  >
) => (props: Props) => (
  <Consumer>
    {(budgetContext: BudgetContext | null) => (
      <Component {...props} budgetContext={budgetContext} />
    )}
  </Consumer>
);
