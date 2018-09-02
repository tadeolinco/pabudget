import faker from 'faker';
import React, { Component } from 'react';
import { range } from '../utils';

const { Consumer, Provider } = React.createContext();

export class BudgetProvider extends Component {
  constructor(props) {
    super(props);
    const NUM_OF_GROUPS = 3;

    const groups = [];
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

    this.state.updateBudgetItem = (groupId, itemId, changes) => {
      this.setState({
        groups: groups.map(group => {
          if (group._id === groupId) {
            group.items = group.items.map(item => {
              if (item._id === itemId) return { ...item, ...changes };
              return item;
            });
          }
          return group;
        }),
      });
    };
  }

  render() {
    return <Provider value={{ ...this.state }}>{this.props.children}</Provider>;
  }
}

export const withBudget = Component => props => (
  <Consumer>
    {budgetContext => <Component {...props} budgetContext={budgetContext} />}
  </Consumer>
);
