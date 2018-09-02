import React, { Component, Fragment } from 'react';
import { ScrollView } from 'react-native';
import { BudgetHeader, BudgetList, Header } from '../components';
import { withBudget } from '../context';

class BudgetScreen extends Component {
  render() {
    const { budgetContext } = this.props;
    let totalBudget = 0;
    let totalAvailable = 0;
    for (const group of budgetContext.groups) {
      for (const item of group.items) {
        totalBudget += item.budget;
        totalAvailable += item.available;
      }
    }

    return (
      <Fragment>
        <Header title="Budget" />
        <BudgetHeader
          totalBudget={totalBudget}
          totalAvailable={totalAvailable}
        />
        <ScrollView>
          {budgetContext.groups.map((group, index) => (
            <BudgetList key={group._id} group={group} first={index === 0} />
          ))}
        </ScrollView>
      </Fragment>
    );
  }
}

export default withBudget(BudgetScreen);
