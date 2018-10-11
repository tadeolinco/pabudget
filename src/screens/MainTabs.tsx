import React from 'react'
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import { Tabs } from '../components'

type Props = {
  navigation?: NavigationScreenProp<any>
}

const MainTabs = ({ navigation }: Props) => {
  const tabItems = [
    {
      text: 'Transaction',
      icon: 'plus-circle',
      onPress: () => navigation.navigate('Transaction'),
    },
    {
      text: 'Budget',
      icon: 'money-bill-alt',
      onPress: () => navigation.navigate('Budget'),
    },
    {
      text: 'Accounts',
      icon: 'credit-card',
      onPress: () => navigation.navigate('Accounts'),
    },
    {
      text: 'Settings',
      icon: 'sliders-h',
      onPress: () => navigation.navigate('Budget'),
    },
  ]
  return <Tabs items={tabItems} />
}

export default withNavigation(MainTabs)
