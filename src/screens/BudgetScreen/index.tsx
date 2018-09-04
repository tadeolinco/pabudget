import { Animated, Easing } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import AddBudgetScreen from './AddBudgetScreen'
import BudgetScreen from './BudgetScreen'

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.inOut(Easing.poly(5)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })

      return { transform: [{ translateX }] }
    },
  }
}

const BudgetStack = createStackNavigator(
  {
    Budget: BudgetScreen,
    AddBudget: AddBudgetScreen,
  },
  { headerMode: 'none', transitionConfig }
)

export default BudgetStack
