import _ from 'lodash'
import { fold } from 'fp-ts/lib/Either'
import * as React from 'react'
import * as t from 'io-ts'
import dataFiles from '../data/dataFiles'

const EdgeData = t.type({
  Requirements: t.string,
  Description: t.string,
})

export type Edge = t.TypeOf<typeof EdgeData>

const Data = t.partial({
  Edges: t.dictionary(t.string, EdgeData)
})

export type AllData = t.TypeOf<typeof Data>

const decodeOrThrow = fold(
  (l: t.Errors) => {
    throw new Error(`${l.length} errors found: ${l.map(e =>
      (e.message || '') + '\n - ' + e.context.map(({ actual, key }) =>
        JSON.stringify({ actual, key }, null, 2)
      ).join('\n - ')
    ).join('\n')}`)
  },
  (r: AllData) => r
)

export const allData = decodeOrThrow(Data.decode(_.merge(
  {},
  ..._.values<AllData>(dataFiles).map(v => decodeOrThrow(Data.decode(v)))
)))

export const DataContext = React.createContext(allData)