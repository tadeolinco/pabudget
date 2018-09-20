import React, { Component, Fragment } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp } from 'react-navigation'
import {
  BudgetHeader,
  BudgetList,
  Header,
  Loader,
  Tabs,
} from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { COLORS, FONT_SIZES } from '../../utils'

type Props = {
  budgetContext: BudgetContext
  navigation: NavigationScreenProp<any>
}

type State = {}

class BudgetScreen extends Component<Props, State> {
  tabItems = [
    {
      text: 'Budget',
      icon: 'money-bill-alt',
      onPress: () => {
        this.props.navigation.navigate('Budget')
      },
    },
    {
      text: 'Accounts',
      icon: 'credit-card',
      onPress: () => {
        this.props.navigation.navigate('Budget')
      },
    },
    {
      text: 'Settings',
      icon: 'sliders-h',
      onPress: () => {
        this.props.navigation.navigate('Budget')
      },
    },
  ]

  render() {
    const {
      budgetContext: { groups, isFetchingGroups },
    } = this.props
    let totalBudget = 0
    let totalUsed = 0
    const computed = {}
    for (const group of groups) {
      computed[group.id] = { budget: 0, used: 0, perItem: {} }

      for (const item of group.items) {
        computed[group.id].perItem[item.id] = 0

        totalBudget += item.budget
        computed[group.id].budget += item.budget

        for (const transaction of item.transactions) {
          computed[group.id].perItem[item.id] += transaction.amount
          computed[group.id].used += transaction.amount
          totalUsed += transaction.amount
        }
      }
    }
    const totalAvailable = totalBudget - totalUsed

    return (
      <Fragment>
        <Header
          title="Budget"
          right={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ArrangeBudget')
              }}
            >
              <Icon name="list" color="white" size={FONT_SIZES.LARGE} />
            </TouchableOpacity>
          }
        />
        <BudgetHeader
          totalBudget={totalBudget}
          totalAvailable={totalAvailable}
        />
        {groups.length === 0 ? (
          <View style={[styles.container, styles.center]}>
            <Text style={styles.text}>No budget groups yet.</Text>
          </View>
        ) : (
          <ScrollView style={styles.container}>
            {groups.map((group, index) => (
              <BudgetList
                key={group.id}
                group={group}
                computed={computed[group.id]}
                first={index === 0}
              />
            ))}
          </ScrollView>
        )}
        <Tabs items={this.tabItems} />
        <Loader active={isFetchingGroups} />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZES.TINY,
  },
})

export default withBudget(BudgetScreen)
