import faker from 'faker';
import React from 'react';
import { range } from '../utils';

export type Props = {};

export type State = {
  groups: any[];
};

export interface BudgetContext extends State {
  updateBudgetItem: (groupId: string, itemId: string, changes: any) => void;
}

const { Consumer, Provider } = React.createContext<BudgetContext | null>(null);

export class BudgetProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const NUM_OF_GROUPS = 3;

    const groups: any[] = [];
    for (let i = 0; i < NUM_OF_GROUPS; ++i) {
      const name = faker.commerce.product();
      const NUM_OF_ITEMS = range(3, 5);
      const items = [];
      const _id = faker.random.uuid();
      for (let j = 0; j < NUM_OF_ITEMS; ++j) {
        items.push({
          _id: faker.random.uuid(),
          name: faker.commerce.product(),
          budget: range(0, 1000),
          available: range(-250, 1000),
          groupId: _id,
        });
      }

      groups.push({ name, items, _id });
    }
    this.state = { groups };
  }

  updateBudgetItem = (groupId: string, itemId: string, changes: any) => {
    this.setState({
      groups: this.state.groups.map(group => {
        if (group._id === groupId) {
          group.items = group.items.map((item: any) => {
            if (item._id === itemId) return { ...item, ...changes };
            return item;
          });
        }
        return group;
      }),
    });
  };

  render() {
    const value: BudgetContext = {
      ...this.state,
      updateBudgetItem: this.updateBudgetItem,
    };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export const withBudget = () => <Props extends {}>(
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
