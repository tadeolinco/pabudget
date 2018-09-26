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
import { Header, Loader } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { COLORS, FONT_SIZES } from '../../utils'
import MainTabs from '../MainTabs'
import { BudgetHeader, BudgetList } from './components'

type Props = {
  budgetContext: BudgetContext
  navigation: NavigationScreenProp<any>
}

type State = {}

class BudgetScreen extends Component<Props, State> {
  render() {
    const {
      budgetContext: {
        groups,
        isFetchingGroups,
        totalAvailable,
        totalBudget,
        totalPerGroup,
      },
    } = this.props

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
                totalPerGroup={totalPerGroup.get(group.id)}
                first={index === 0}
              />
            ))}
          </ScrollView>
        )}
        <MainTabs />
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
