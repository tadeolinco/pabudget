import React, { Component, Fragment } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { NavigationScreenProp } from 'react-navigation'
import { getRepository } from 'typeorm/browser'
import { Header, Input, Loader, Tabs } from '../../components'
import { BudgetContext, withBudget } from '../../context'
import { BudgetGroup, BudgetItem } from '../../entities'
import { COLORS, FONT_SIZES } from '../../utils'

type Props = {
  navigation: NavigationScreenProp<any>
  budgetContext: BudgetContext
}

type State = {
  isAddingGroup: boolean
  groupName: string
  itemNames: string[]
}

class NewBudgetScreen extends Component<Props, State> {
  state: State = {
    isAddingGroup: false,
    groupName: '',
    itemNames: [''],
  }

  handleChangeGroupName = text => {
    this.setState({ groupName: text })
  }

  handleAddItem = () => {
    const { itemNames } = this.state
    itemNames.push('')
    this.setState({ itemNames })
  }

  handleChangeItemName = (text, index) => {
    const { itemNames } = this.state
    itemNames[index] = text
    this.setState({ itemNames })
  }

  handleDeleteItem = index => {
    const { itemNames } = this.state
    itemNames.splice(index, 1)
    this.setState({ itemNames })
  }

  handleAddGroup = async () => {
    try {
      const {
        budgetContext: { groups, fetchBudgetGroups },
      } = this.props

      this.setState({ isAddingGroup: true })

      const budgetGroupRepository = getRepository(BudgetGroup)
      const newBudgetGroup = new BudgetGroup()
      newBudgetGroup.name = this.state.groupName.trim()
      newBudgetGroup.order = groups.length

      await budgetGroupRepository.save(newBudgetGroup)

      const newItems = this.state.itemNames
        .filter(itemName => !!itemName.trim())
        .map((itemName, index) => {
          const newItem = new BudgetItem()
          newItem.group = newBudgetGroup
          newItem.name = itemName.trim()
          newItem.order = index
          return newItem
        })
      await getRepository(BudgetItem).save(newItems)

      await fetchBudgetGroups()
      this.props.navigation.goBack()
    } catch (err) {
      console.warn(err)
    } finally {
      this.setState({ isAddingGroup: false })
    }
  }

  render() {
    const { isAddingGroup, groupName, itemNames } = this.state

    const tabItems = [
      {
        text: 'Add Item',
        icon: 'plus',
        onPress: this.handleAddItem,
      },
      {
        text: 'Add Group',
        icon: 'check',
        onPress: this.handleAddGroup,
        disabled:
          groupName.trim().length === 0 ||
          !itemNames.some(name => name.trim().length > 0),
      },
    ]

    return (
      <Fragment>
        <Header title="New Budget" hasBack />
        <ScrollView style={styles.container}>
          <Text style={styles.label}>Group Name</Text>
          <View style={styles.itemContainer}>
            <Input
              style={styles.input}
              placeholder="Name"
              value={groupName}
              onChangeText={this.handleChangeGroupName}
            />
          </View>
          <Text style={styles.label}>Items</Text>
          {itemNames.map((item, index) => (
            <View
              style={[
                styles.itemContainer,
                { marginBottom: index === itemNames.length - 1 ? 20 : 10 },
              ]}
              key={index}
            >
              <Input
                style={styles.input}
                placeholder={`Item #${index + 1}`}
                value={item}
                onChangeText={text => {
                  this.handleChangeItemName(text, index)
                }}
              />
              <TouchableOpacity
                disabled={itemNames.length === 1}
                style={styles.deleteIconContainer}
                onPress={() => {
                  this.handleDeleteItem(index)
                }}
              >
                <Icon
                  name="trash"
                  style={[
                    styles.deleteIcon,
                    {
                      color:
                        itemNames.length === 1 ? COLORS.GRAY : COLORS.DARK_GRAY,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <Tabs items={tabItems} />
        <Loader active={isAddingGroup} />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  label: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.BLACK,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIconContainer: {
    padding: 10,
  },
  deleteIcon: {
    color: COLORS.DARK_GRAY,
    fontSize: FONT_SIZES.REGULAR,
  },
  input: {
    flex: 1,
  },
})

export default withBudget(NewBudgetScreen)
