import React, { AnimationEventHandler } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
} from 'react-native'
import { AnimatedValue } from 'react-navigation'
import { COLORS, FONT_SIZES } from '../utils'
import { AnimationTimingFunctionProperty } from 'csstype'

const { height, width } = Dimensions.get('window')

type Props = {
  active: boolean
  text?: string
}

type State = {
  opacity: AnimatedValue
  zIndex: AnimatedValue
}

class Loader extends React.Component<Props, State> {
  timer = null
  timeout = null

  state: State = {
    opacity: new Animated.Value(this.props.active ? 1 : 0),
    zIndex: new Animated.Value(this.props.active ? 10 : -10),
  }

  componentWillUnmount() {
    if (this.timer) this.timer.stop()
    if (this.timeout) clearTimeout(this.timeout)
  }

  componentDidUpdate(prevProps) {
    const ANIMATION_DURATION = 250
    if (prevProps.active !== this.props.active) {
      this.timer = Animated.timing(this.state.opacity, {
        toValue: this.props.active ? 1 : 0,
        easing: Easing.inOut(Easing.quad),
        duration: ANIMATION_DURATION,
      }).start()
      if (this.props.active) {
        this.setState({ zIndex: 10 })
      } else {
        this.timeout = setTimeout(() => {
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
        {!!this.props.text && (
          <Text style={styles.text}>{this.props.text}</Text>
        )}
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
    top: 0,
    left: 0,
  },
  text: {
    marginTop: 10,
    color: 'white',
    fontSize: FONT_SIZES.TINY,
  },
})

export default Loader
