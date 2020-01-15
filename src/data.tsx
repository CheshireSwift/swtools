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
  _.mapValues(data, dataField => ({ ..._.mapValues(dataField, entry => ({ ...entry, Source })) }))

const processor = (source: string) => _.flow(Data.decode, throwDecodeFailure, appendSource(source))
const processFile = (fileData: FileData, source: string) => processor(source)(fileData)

export type Edge = Sourced<RawEdge>

type AllData = {
  Edges?: { [name in string]: Edge }
}

const sourceAnnotationMarker = '!/!'
type SourcedData = Sourced<AllData>
const fileMerger = (existingValue: SourcedData['Edges'], newValue: SourcedData['Edges']): AllData | undefined => {
  if (!existingValue || !newValue) {
    return
  }

  const edgesLists = [existingValue, newValue]
  const nameLists: string[][] = edgesLists.map(n => _.keys(n))
  const overlappingEntries: string[] = _.intersection(...nameLists)
  const naiveMerge: SourcedData['Edges'] = { ...existingValue, ...newValue }
  const easyOnes: AllData['Edges'] = _.omit<any>(naiveMerge, ...overlappingEntries)

  const modifiedOnes: AllData['Edges'] = _.assign(
    {},
    ..._.map(overlappingEntries, sharedName => ({
      [sharedName + sourceAnnotationMarker + existingValue[sharedName].Source]: existingValue[sharedName],
      [sharedName + sourceAnnotationMarker + newValue[sharedName].Source]: newValue[sharedName],
    })),
  )

  return { ...easyOnes, ...modifiedOnes }
}

const processedFiles = _.map(dataFiles, processFile)
const allFileData: AllData = _.assignWith({}, ...processedFiles, fileMerger)

function processData(fileData: AllData) {
  const lookups = {}
  const Edges = new Map(
    _.map(fileData.Edges, (edge, name) => [
      name.split(sourceAnnotationMarker) as [string] | [string, string],
      { ...edge, Requirements: edge.Requirements.split(', ') },
    ]),
  )
  return { Edges, lookups }
}
export const allData = processData(allFileData)

export const DataContext = React.createContext(allData)
