import _ from 'lodash'
import * as React from 'react'
import dataFiles from '../data/dataFiles'

/// Utility types

type Dictionary<T> = { [k: string]: T }

/// Input types

type EdgeData = {
  Requirements: string
  Description: string
}

type ItemData = {
  Cost: string
  Weight: string
  Notes?: string
}

type ShorthandItem = string

type FileData = {
  Edges?: Dictionary<EdgeData>
  Items?: Dictionary<Dictionary<ItemData | ShorthandItem>>
}

/// Output types

export type Edge = {
  name: string
  source: string
  requirements: string[]
  description: string
  duplicated: boolean
}
export type Item = {
  name: string
  source: string
  category: string
  cost: string
  weight: string
  notes?: string
}
export type AllData = {
  edges: Edge[]
  items: Item[]
}

// const addSource = <T extends {}>(Source: string) => (entry: T) => ({ ...entry, Source } as Sourced<T>)

// const processFile = (data: FileData, source: string) =>
//   _.mapValues<FileData, SourcedData>(data, dataField => _.mapValues(dataField, addSource(source))) as SourcedData

// type SourcedData = {
//   Edges?: Dictionary<Sourced<EdgeData>>
//   Items?: Dictionary<Sourced<ItemData>>
// }

// function fileMerger(existingValues: Edge[], newValues: { [k: string]: Edge }): Edge[]
// function fileMerger(existingValues: Item[], newValues: { [k: string]: Item }): Item[]
// function fileMerger<T>(existingValues: Named<T>[], newValues: { [k: string]: T }): Named<T>[] {
//   const swapPair = (v: T, k: string): Named<T> => ({ ...v, Name: k })
//   const newPairs = _.map(newValues, swapPair)
//   return [...existingValues, ...newPairs]
// }

// const processedFiles: SourcedData[] = _.map(dataFiles as { [source: string]: FileData }, processFile)

// const allFileData: AllData = _.mapValues(
//   {
//     Edges: [] as Edge[],
//     Items: [] as Item[],
//   } as AllData,
//   (_empty, key) => _.reduce(_.map(processedFiles, key), fileMerger, []) as any[],
// )

// function processData(fileData: AllData) {
//   const lookups = {}
//   const Edges = _.map(fileData.Edges, edge => ({
//     ...edge,
//     Requirements: edge.Requirements.split(', '),
//     duplicated: _.filter(fileData.Edges, { Name: edge.Name }).length > 1,
//   }))
//   return { Edges, lookups }
// }
// export const allData = processData(allFileData)

function processData(dataFiles: Dictionary<FileData>): AllData {
  const allEdges = _.compact(
    _.flatMap(dataFiles, (file, source) => {
      if (!file.Edges) {
        return []
      }

      return _.map(file.Edges, ({ Requirements, Description }, name) => ({
        name,
        source,
        requirements: Requirements.split(',').map(r => r.trim()),
        description: Description,
      }))
    }),
  )

  const items = _.compact(
    _.flatMap(dataFiles, (file, source) => {
      if (!file.Items) {
        return []
      }

      return _.flatMap(file.Items, (items, category): Item[] =>
        _.map(items, (item, name) => {
          const partial = { name, source, category }
          if (_.isString(item)) {
            const [cost, ...weight] = item.split(' ')
            return { ...partial, cost, weight: weight.join(' ') }
          } else {
            const { Cost, Weight, Notes } = item
            return { ...partial, cost: Cost, weight: Weight, notes: Notes }
          }
        }),
      )
    }),
  )

  return {
    edges: _.map(allEdges, edge => ({ ...edge, duplicated: _.filter(allEdges, { Name: edge.name }).length > 1 })),
    items,
  }
}

export const allData = processData(dataFiles)

export const DataContext = React.createContext(allData)
