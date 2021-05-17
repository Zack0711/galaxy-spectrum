import React, { useState, useEffect } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"
import CssBaseline from '@material-ui/core/CssBaseline'

import store from './store'

import Landing from './pages/landing.jsx'
import SpectrumTemperature from './pages/spectrum-temperature.jsx'
import SpectrumComposition from './pages/spectrum-composition.jsx'
import SpectrumRedshift from './pages/spectrum-redshift.jsx'

import {
  init,
  updateViewedSpectrum,
} from './actions'

import {
  getViewed,
  getViewedID,
} from './selectors/spectrum'

const GalaxySpectrum = () => {

  const dispatch = useDispatch()

  const data = useSelector(getViewed)
  const id = useSelector(getViewedID)

  useEffect(() => {
    if (id) {
      if (!data.id || data.id !== id) {
        dispatch(updateViewedSpectrum)
      }
    } else {
      dispatch(init)
    }
  }, [id])

  return (
    <Router>
      <CssBaseline/>
      <Switch>
        <Route exact path="/" children={<Landing />} />
        <Route exact path="/spectrum-temperature" children={<SpectrumTemperature />} />
        <Route exact path="/spectrum-composition" children={<SpectrumComposition />} />
        <Route exact path="/spectrum-redshift" children={<SpectrumRedshift />} />
      </Switch>
    </Router>
  )
}

const App = () => (
  <Provider store={store}>
    <GalaxySpectrum />
  </Provider>
)

ReactDOM.render( <App />, document.getElementById('root'),)