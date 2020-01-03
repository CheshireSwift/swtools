import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { allData } from './data'

ReactDOM.render(
  <div>
    <pre>{JSON.stringify(allData, null, 2)}</pre>
  </div>,
  document.getElementById('app'),
)
