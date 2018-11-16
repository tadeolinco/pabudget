import React, { Component, Fragment } from 'react'
import MainTabs from '../MainTabs'
import { Header, Button, Loader } from '../../components'
import { View, StyleSheet, Text, FlatList, Alert } from 'react-native'
import { COLORS, FONT_SIZES } from '../../utils'
import { getConnection } from 'typeorm/browser'
import { BudgetTransaction } from '../../entities'
import VersionNumber from 'react-native-version-number'
import { connect } from 'react-redux'

type Props = {
  fetchBudgets: () => void
}
type State = {
  isResettingBudgets: boolean
}

class SettingsScreen extends Component<Props, State> {
  state: State = {
    isResettingBudgets: false,
  }

  resetBudgets = async () => {
    Alert.alert('Are you sure?', 'This action will reset all your budgets.', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: async () => {
          this.setState({ isResettingBudgets: true })

          await getConnection()
            .createQueryBuilder()
            .update(BudgetTransaction)
            .set({ active: false })
            .where({ active: true })
            .execute()

          await this.props.fetchBudgets()

          this.setState({ isResettingBudgets: false })
        },
      },
    ])
  }

  settings = [
    {
      description: 'Reset Budgets',
      button: {
        text: 'RESET',
        onPress: this.resetBudgets,
        buttonColor: COLORS.RED,
        loading: this.state.isResettingBudgets,
      },
    },
  ]

  renderSettingsItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        index === this.settings.length - 1 && { borderWidth: 0 },
      ]}
    >
      <View style={styles.cell}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.cell}>
        <Button {...item.button} rounded />
      </View>
    </View>
  )

  render() {
    return (
      <Fragment>
        <Header
          title="Settings"
          right={
            <View style={{ paddingRight: 10 }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: FONT_SIZES.TINY,
                  textAlign: 'right',
                }}
              >
                v{VersionNumber.appVersion}
              </Text>
            </View>
          }
        />
        <FlatList
          contentContainerStyle={styles.container}
          style={{ backgroundColor: 'white' }}
          keyExtractor={(item, index) => String(index)}
          data={this.settings}
          renderItem={this.renderSettingsItem}
        />
        <MainTabs />
        <Loader
          active={this.state.isResettingBudgets}
          text="Resetting budgets..."
        />
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
  description: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const mapState = state => ({})

const mapDispatch = dispatch => ({
  fetchBudgets: dispatch.budget.fetchBudgets,
})

export default connect(
  mapState,
  mapDispatch
)(SettingsScreen)
