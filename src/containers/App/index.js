import React from 'react'
import { Route } from 'react-router-dom'

import Header from '../../components/Header'
import Home from '../Home'

const App = props => (
  <div>
    <Route path='/' component={Header} />
    <Route exact path='/' component={Home} />
  </div>
)

export default App
