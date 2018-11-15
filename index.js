import React from 'react'
import { AppRegistry, YellowBox } from 'react-native'
import 'reflect-metadata'
import { name as appName } from './app.json'
import App from './src/App'
import store from './src/store'
import { Provider } from 'react-redux'
import './src/polyfills'

YellowBox.ignoreWarnings([
  'Remote debugger is in a background tab which may cause apps to perform slowly.',
])

const AppContainer = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => AppContainer)
