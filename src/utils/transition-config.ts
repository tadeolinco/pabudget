import { Animated, Easing } from 'react-native'

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0,
    },
  }
}

export default transitionConfig
