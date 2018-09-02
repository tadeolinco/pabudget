import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../utils';
import BudgetListItem from './BudgetListItem';

const styles = StyleSheet.create({
  container: {
    borderTopColor: COLORS.GRAY,
  },
});

const BudgetList = ({ group, first = false }) => {
  let groupBudget = 0;
  let groupAvailable = 0;
  for (const item of group.items) {
    groupBudget += item.budget;
    groupAvailable += item.available;
  }

  return (
    <View style={[styles.container, { borderTopWidth: first ? 0 : 20 }]}>
      <BudgetListItem
        header
        name={group.name}
        budget={groupBudget}
        available={groupAvailable}
      />
      {group.items.map((item, index) => (
        <BudgetListItem
          key={item._id}
          {...item}
          last={index === group.items.length - 1}
        />
      ))}
    </View>
  );
};

export default BudgetList;
