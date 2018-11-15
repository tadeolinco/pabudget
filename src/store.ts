import selectPlugin from '@rematch/select'
import { init } from '@rematch/core'
import * as models from './models'
import logger from 'redux-logger'

const store = init({
  models,
  plugins: [selectPlugin()],
  redux: {
    middlewares: [logger],
  },
})

export default store
