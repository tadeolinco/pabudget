import React, { Fragment, Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp } from 'react-navigation'
import {
  Header,
  Loader,
  Button,
  Modal,
  Input,
  CurrencyInput,
} from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { COLORS, FONT_SIZES } from '../../utils'
import MainTabs from '../MainTabs'
import { BudgetHeader, BudgetListItem } from './components'
import SortableListView from 'react-native-sortable-listview'
import { Budget } from '../../entities'

type Props = {
  budgetContext: BudgetContext
  navigation: NavigationScreenProp<any>
}

type State = {
  isAddModalVisible: boolean
  newBudgetName: string
  newBudgetAmount: number
}

class BudgetScreen extends Component<Props, State> {
  state: State = {
    isAddModalVisible: false,
    newBudgetName: '',
    newBudgetAmount: 0,
  }

  handleAddBudget = async () => {
    this.setState({ isAddModalVisible: false })
    await this.props.budgetContext.addBudget(
      this.state.newBudgetName.trim(),
      this.state.newBudgetAmount
    )
  }

  handleOpenAddModal = () => {
    this.setState({
      isAddModalVisible: true,
      newBudgetName: '',
      newBudgetAmount: 0,
    })
  }

  render() {
    const {
      budgetContext: {
        budgets,
        isFetchingBudgets,
        totalAvailable,
        totalBudget,
        availablePerBudget,
      },
    } = this.props

    const sortedBudgets = this.props.budgetContext.budgets.reduce(
      (acc, curr) => {
        acc[curr.order] = curr
        return acc
      },
      {}
    )

    const order = Object.keys(sortedBudgets)
      .map(key => sortedBudgets[key].order)
      .sort((a, b) => a - b)

    return (
      <Fragment>
        <Header
          title="Budget"
          right={
            <TouchableOpacity
              onPress={this.handleOpenAddModal}
              style={{
                padding: 10,
              }}
            >
              <Icon name="plus" color="white" size={FONT_SIZES.LARGE} />
            </TouchableOpacity>
          }
        />
        <BudgetHeader
          totalBudget={totalBudget}
          totalAvailable={totalAvailable}
        />
        {budgets.length === 0 ? (
          <View style={[styles.container, styles.center]}>
            <Button
              text="ADD BUDGET"
              onPress={this.handleOpenAddModal}
              buttonColor={COLORS.BLUE}
              rounded
            />
          </View>
        ) : (
          <Fragment>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderColor: COLORS.GRAY,
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  paddingLeft: 5,
                  flex: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZES.TINY,
                    fontWeight: 'bold',
                    color: COLORS.BLACK,
                  }}
                >
                  Name
                </Text>
              </View>
              <View
                style={{
                  paddingRight: 5,
                  flex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZES.TINY,
                    fontWeight: 'bold',
                    color: COLORS.BLACK,
                    textAlign: 'right',
                  }}
                >
                  Budget
                </Text>
              </View>
              <View
                style={{
                  paddingRight: 5,
                  flex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZES.TINY,
                    fontWeight: 'bold',
                    color: COLORS.BLACK,
                    textAlign: 'right',
                  }}
                >
                  Available
                </Text>
              </View>
            </View>
            <SortableListView
              moveOnPressIn
              activeOpacity={0.75}
              style={{ backgroundColor: 'white' }}
              data={sortedBudgets}
              order={order}
              renderRow={(budget: Budget) => (
                <BudgetListItem
                  key={budget.id}
                  budget={budget}
                  available={availablePerBudget.get(budget.id)}
                  updateBudget={this.props.budgetContext.updateBudget}
                />
              )}
              rowHasChanged={a => {
                return true
              }}
              onRowMoved={this.props.budgetContext.arrangeBudgets}
              sortRowStyle={{ backgroundColor: COLORS.GRAY }}
            />
          </Fragment>
        )}
        <MainTabs />
        <Modal
          isVisibile={this.state.isAddModalVisible}
          title="Add Budget"
          onClose={() => this.setState({ isAddModalVisible: false })}
        >
          <Text style={styles.label}>Name</Text>
          <Input
            placeholder="Food"
            style={{ marginBottom: 10 }}
            value={this.state.newBudgetName}
            onChangeText={newBudgetName => this.setState({ newBudgetName })}
          />
          <Text style={styles.label}>Budget</Text>
          <CurrencyInput
            style={{ marginBottom: 10 }}
            value={this.state.newBudgetAmount}
            onChange={newBudgetAmount => this.setState({ newBudgetAmount })}
            useDefaultStyles
          />
          <Button
            full
            rounded
            text="SUBMIT"
            onPress={this.handleAddBudget}
            buttonColor={COLORS.BLUE}
            disabled={!this.state.newBudgetName.trim()}
          />
        </Modal>
        <Loader active={isFetchingBudgets} text="Getting your budget..." />
        <Loader
          active={this.props.budgetContext.isAddingBudget}
          text="Creating budget..."
        />
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
  label: {
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZES.TINY,
    marginBottom: 10,
  },
})

export default withBudget(BudgetScreen)
