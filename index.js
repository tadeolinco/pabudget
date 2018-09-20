import { AppRegistry, YellowBox } from 'react-native'
import 'reflect-metadata'
import { name as appName } from './app.json'
import App from './src/App'
import './src/polyfills'

YellowBox.ignoreWarnings([
  'Remote debugger is in a background tab which may cause apps to perform slowly.',
])

AppRegistry.registerComponent(appName, () => App)
