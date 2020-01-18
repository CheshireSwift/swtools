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
