import React from 'react'
import { Provider } from 'react-redux'
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

const App = () => (
  <Provider store={store}>
    <Router>
      <CssBaseline/>
      <Switch>
        <Route exact path="/" children={<Landing />} />
        <Route exact path="/spectrum-temperature" children={<SpectrumTemperature />} />
        <Route exact path="/spectrum-composition" children={<SpectrumComposition />} />
        <Route exact path="/spectrum-redshift" children={<SpectrumRedshift />} />
      </Switch>
    </Router>
  </Provider>
)

ReactDOM.render( <App />, document.getElementById('root'),)