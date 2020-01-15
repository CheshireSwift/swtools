import { fold } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import _ from 'lodash'
import * as React from 'react'
import dataFiles from '../data/dataFiles'

type Sourced<T> = T & { Source: string }

const EdgeData = t.type({
  Requirements: t.string,
  Description: t.string,
})

type RawEdge = t.TypeOf<typeof EdgeData>

const Data = t.partial({
  Edges: t.dictionary(t.string, EdgeData),
})

type FileData = t.TypeOf<typeof Data>

const throwDecodeFailure = fold(
  (l: t.Errors) => {
    throw new Error(
      `${l.length} errors found: ${l
        .map(
          e =>
            (e.message || '') +
            '\n - ' +
            e.context.map(({ actual, key }) => JSON.stringify({ actual, key }, null, 2)).join('\n - '),
        )
        .join('\n')}`,
    )
  },
  (r: FileData) => r,
)

const appendSource = (Source: string) => (data: FileData) =>
  _.mapValues(data, dataField => ({ ..._.mapValues(dataField, entry => ({ ...entry, Source })), Source }))

const processor = (source: string) => _.flow(Data.decode, throwDecodeFailure, appendSource(source))
const processFile = (fileData: FileData, source: string) => processor(source)(fileData)

type AllData = {
  [F in keyof FileData]: Sourced<SourcedChildren<FileData[F]>>
}

type SourcedChildren<T> = {
  [K in keyof T]: Sourced<T[K]>
}

const fileMerger = <K extends keyof AllData, FieldData = Sourced<AllData[K]>>(
  existingValue: FieldData,
  newValue: FieldData,
): FieldData | undefined => {
  if (!existingValue || !newValue) {
    return
  }

  type FK = keyof FieldData
  const values = [existingValue, newValue]
  const keysLists: FK[][] = values.map(v => _.keys(v))
  const overlappingEntries: FK[] = _.intersection(...keysLists)
  const naiveMerge: FieldData = { ...existingValue, ...newValue }
  const easyOnes: FieldData = _.omit<any>(naiveMerge, ...overlappingEntries) as FieldData
  const modifiedOnes: FieldData = _.assign(
    _.map(overlappingEntries, sharedKey => ({
      [`${sharedKey} (${existingValue[sharedKey].Source})`]: existingValue[sharedKey],
      [`${sharedKey} (${newValue[sharedKey].Source})`]: newValue[sharedKey],
    })),
  )

  return { ...easyOnes, ...modifiedOnes }
}

// const valueMerger = <K extends keyof AllData>(o: AllData[K], s, k) => {
//   console.log({ o, s, k })
//   if (o && s) {
//   }
// }

const allFileData: AllData = _.assignWith({}, ..._.map(dataFiles, processFile), fileMerger)
console.log(allFileData)

function processData(fileData: AllData) {
  const lookups = {}
  const Edges = _.mapValues(fileData.Edges, (edge: RawEdge) => ({
    ...edge,
    Requirements: edge.Requirements.split(', '),
  }))
  return { Edges, lookups }
}

export const allData = processData(allFileData)

export const DataContext = React.createContext(allData)
