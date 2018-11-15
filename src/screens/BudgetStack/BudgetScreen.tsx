import React, { Fragment, Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProp } from 'react-navigation'
import { connect } from 'react-redux'
import {
  Header,
  Loader,
  Button,
  Modal,
  Input,
  CurrencyInput,
} from '../../components'
import { COLORS, FONT_SIZES } from '../../utils'
import MainTabs from '../MainTabs'
import { BudgetHeader, BudgetListItem } from './components'
import SortableListView from 'react-native-sortable-listview'
import { Budget } from '../../entities'

type Props = {
  navigation: NavigationScreenProp<any>
  budgets: Budget[]
  addBudget: (budget: { name: string; amount: number }) => void
  updateBudget: (budget: Budget) => void
  deleteBudget: (budget: Budget) => void
  arrangeBudgets: (event: { to: number; from: number }) => void
  isAddingBudget: boolean
  isDeletingBudget: boolean
  isFetchingBudgets: boolean
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
    requestAnimationFrame(async () => {
      await this.props.addBudget({
        name: this.state.newBudgetName.trim(),
        amount: this.state.newBudgetAmount,
      })
    })
  }

  handleOpenAddModal = () => {
    this.setState({
      isAddModalVisible: true,
      newBudgetName: '',
      newBudgetAmount: 0,
    })
  }

  showTransactions = (budget: Budget) => {
    this.props.navigation.navigate('BudgetTransactions', { budget })
  }

  render() {
    const sortedBudgets = this.props.budgets.reduce((acc, curr) => {
      acc[curr.order] = curr
      return acc
    }, {})

    const order = Object.keys(sortedBudgets)
      .map(key => sortedBudgets[key].order)
      .sort((a, b) => a - b)

    return (
      <Fragment>
        <Header
          title="Budget"
          right={
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this.handleOpenAddModal}
              style={{
                padding: 10,
              }}
            >
              <Icon name="plus" color="white" size={FONT_SIZES.LARGE} />
            </TouchableOpacity>
          }
        />
        {/* <BudgetHeader budget={totalBudget} available={totalAvailable} /> */}
        {this.props.budgets.length === 0 ? (
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
            <View style={styles.row}>
              <View
                style={{ paddingLeft: 5, flex: 3, justifyContent: 'center' }}
              >
                <Text style={[styles.text, { fontWeight: 'bold' }]}>Name</Text>
              </View>
              <View style={styles.cell}>
                <Text
                  style={[
                    styles.text,
                    { textAlign: 'right', fontWeight: 'bold' },
                  ]}
                >
                  Budget
                </Text>
              </View>
              <View style={styles.cell}>
                <Text
                  style={[
                    styles.text,
                    { textAlign: 'right', fontWeight: 'bold' },
                  ]}
                >
                  Available
                </Text>
              </View>
            </View>
            {/* <SortableListView
              moveOnPressIn
              activeOpacity={0.6}
              style={{ backgroundColor: 'white' }}
              data={sortedBudgets}
              order={order}
              renderRow={(budget: Budget) => (
                <BudgetListItem
                  key={budget.id}
                  budget={budget}
                  available={availablePerBudget.get(budget.id)}
                  updateBudget={this.props.updateBudget}
                  deleteBudget={this.props.deleteBudget}
                  showTransactions={this.showTransactions}
                />
              )}
              rowHasChanged={a => {
                return true
              }}
              onRowMoved={this.props.arrangeBudgets}
              sortRowStyle={{ backgroundColor: COLORS.GRAY }}
            /> */}
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
        <Loader
          active={this.props.isFetchingBudgets}
          text="Getting your budget..."
        />
        <Loader active={this.props.isAddingBudget} text="Creating budget..." />
        <Loader
          active={this.props.isDeletingBudget}
          text="Deleting budget..."
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
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.BLACK,
  },
  cell: { paddingRight: 5, flex: 2, justifyContent: 'center' },
})

const mapState = state => {
  const {
    budgets,
    isAddingBudget,
    isDeletingBudget,
    isFetchingBudgets,
  } = state.budget
  return { budgets, isAddingBudget, isDeletingBudget, isFetchingBudgets }
}

const mapDispatch = dispatch => {
  const {
    addBudget,
    updateBudget,
    deleteBudget,
    arrangeBudgets,
  } = dispatch.budget
  return { addBudget, updateBudget, deleteBudget, arrangeBudgets }
}

export default connect(
  mapState,
  mapDispatch
)(BudgetScreen)
