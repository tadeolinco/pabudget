import React from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
} from 'react-native'
import { AnimatedValue } from 'react-navigation'
import { COLORS } from '../utils'

const { height, width } = Dimensions.get('window')

type Props = {
  active: boolean
}

type State = {
  opacity: AnimatedValue
  zIndex: number
}

class Loader extends React.Component<Props, State> {
  state: State = {
    opacity: new Animated.Value(0),
    zIndex: this.props.active ? 10 : -10,
  }

  componentDidUpdate(prevProps) {
    const ANIMATION_DURATION = 250
    if (prevProps.active !== this.props.active) {
      Animated.timing(this.state.opacity, {
        toValue: this.props.active ? 1 : 0,
        easing: Easing.inOut(Easing.quad),
        duration: ANIMATION_DURATION,
      }).start()
      if (this.props.active) {
        this.setState({ zIndex: 10 })
      } else {
        setTimeout(() => {
          this.setState({
            zIndex: -10,
          })
        }, ANIMATION_DURATION)
      }
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            height,
            width,
            opacity: this.state.opacity,
            zIndex: this.state.zIndex,
          },
        ]}
      >
        <ActivityIndicator color="white" size={100} />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: COLORS.DARK_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Loader
