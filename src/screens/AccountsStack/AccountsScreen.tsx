import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import {
  Header,
  Loader,
  Button,
  Modal,
  CurrencyInput,
  Input,
} from '../../components'
import MainTabs from '../MainTabs'
import { AccountsHeader, AccountItem } from './components'
import { withAccounts, AccountsContext } from '../../context'
import { FONT_SIZES, COLORS } from '../../utils'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Account } from '../../entities'
import SortableListView from 'react-native-sortable-listview'

type Props = {
  navigation: NavigationScreenProp<any>
  accountsContext: AccountsContext
}

type State = {
  isAddModalVisible: boolean
  newAccountName: string
  newAccountInitialAmount: number
  selectedAccount: Account
}

class AccountsScreen extends Component<Props, State> {
  state: State = {
    isAddModalVisible: false,
    newAccountName: '',
    newAccountInitialAmount: 0,
    selectedAccount: null,
  }

  handleOpenAddModal = () => {
    this.setState({
      isAddModalVisible: true,
      newAccountName: '',
      newAccountInitialAmount: 0,
    })
  }

  handleAddAccount = async () => {
    this.setState({ isAddModalVisible: false })
    this.props.accountsContext.addAccount(
      this.state.newAccountName,
      this.state.newAccountInitialAmount
    )
  }

  showTransactions = (account: Account) => {
    this.props.navigation.navigate('AccountTransactions', { account })
  }

  render() {
    const { accountsContext } = this.props
    const { isFetchingAccounts, accounts, amountPerAccount } = accountsContext

    const sortedAccounts = this.props.accountsContext.accounts.reduce(
      (acc, curr) => {
        acc[curr.order] = curr
        return acc
      },
      {}
    )

    const order = Object.keys(sortedAccounts)
      .map(key => sortedAccounts[key].order)
      .sort((a, b) => a - b)

    return (
      <Fragment>
        <Header
          title="Accounts"
          right={
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this.handleOpenAddModal}
              style={{ padding: 10 }}
            >
              <Icon name="plus" color="white" size={FONT_SIZES.LARGE} />
            </TouchableOpacity>
          }
        />
        <AccountsHeader
          netWorth={this.props.accountsContext.netWorth}
          totalAssets={this.props.accountsContext.totalAssets}
          totalLiabilities={this.props.accountsContext.totalLiabilities}
        />
        {accounts.length === 0 ? (
          <View style={[styles.container, styles.center]}>
            <Button
              text="ADD ACCOUNT"
              onPress={this.handleOpenAddModal}
              buttonColor={COLORS.BLUE}
              rounded
            />
          </View>
        ) : (
          <Fragment>
            <View style={styles.row}>
              <View style={styles.headerCell}>
                <Text style={[styles.headerText]}>Name</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={[styles.headerText, { textAlign: 'right' }]}>
                  Total Amount
                </Text>
              </View>
            </View>
            <SortableListView
              moveOnPressIn
              activeOpacity={0.6}
              style={styles.container}
              data={sortedAccounts}
              order={order}
              renderRow={(account: Account) => (
                <AccountItem
                  key={account.id}
                  account={account}
                  totalAmount={amountPerAccount.get(account.id)}
                  showTransactions={this.showTransactions}
                  deleteAccount={this.props.accountsContext.deleteAccount}
                  updateAccount={this.props.accountsContext.updateAccount}
                />
              )}
              rowHasChanged={a => {
                return true
              }}
              onRowMoved={this.props.accountsContext.arrangeAccounts}
              sortRowStyle={{ backgroundColor: COLORS.GRAY }}
            />
          </Fragment>
        )}
        <MainTabs />
        <Modal
          isVisibile={this.state.isAddModalVisible}
          title="Add Account"
          onClose={() => this.setState({ isAddModalVisible: false })}
        >
          <Text style={styles.label}>Name</Text>
          <Input
            placeholder="Savings"
            style={{ marginBottom: 10 }}
            value={this.state.newAccountName}
            onChangeText={newAccountName => this.setState({ newAccountName })}
          />
          <Text style={styles.label}>Initial Amount</Text>
          <CurrencyInput
            style={{ marginBottom: 10 }}
            value={this.state.newAccountInitialAmount}
            onChange={newAccountInitialAmount =>
              this.setState({ newAccountInitialAmount })
            }
            useDefaultStyles
          />
          <Button
            full
            rounded
            text="SUBMIT"
            onPress={this.handleAddAccount}
            buttonColor={COLORS.BLUE}
            disabled={
              !this.state.newAccountName.trim() ||
              !this.state.newAccountInitialAmount
            }
          />
        </Modal>
        <Loader active={isFetchingAccounts} text="Getting your accounts..." />
        <Loader
          active={this.props.accountsContext.isDeletingAccount}
          text="Deleting account..."
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
    padding: 10,
  },
  headerText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'bold',
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.BLACK,
  },
})

export default withAccounts(AccountsScreen)
