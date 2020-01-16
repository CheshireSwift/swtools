import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Items } from './Items'
import Title from '../Title'

ReactDOM.render(
  <>
    <Title>Items</Title>
    <Items />
  </>,
  document.getElementById('app'),
)
