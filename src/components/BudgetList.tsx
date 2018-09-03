import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../utils';
import BudgetListItem from './BudgetListItem';

type Props = {
  group: any;
  first: boolean;
  updateBudgetItem: (groupId: string, itemId: string, changes: any) => void;
};

const BudgetList = ({ group, first = false, updateBudgetItem }: Props) => {
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
      {group.items.map((item: any, index: number) => (
        <BudgetListItem
          key={item._id}
          {...item}
          last={index === group.items.length - 1}
          updateBudgetItem={updateBudgetItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: COLORS.GRAY,
  },
});

export default BudgetList;
