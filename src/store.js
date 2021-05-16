import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers'

/* eslint-disable no-underscore-dangle */
const composeEnhancers = process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose
/* eslint-enable */

let middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middleware = [
    ...middleware,
  ]
}

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(...middleware),
  ),
)

export default store