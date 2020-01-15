import _ from 'lodash'
import * as React from 'react'
import { Column, useSortBy, useTable } from 'react-table'
import { DataContext, Edge } from '../data'
import TooltippedText from '../TooltippedText'

const col = (name: string) => ({ Header: name, accessor: name })
const useHardMemo = (f: () => any[]) => React.useMemo(f, [])

export const Edges = () => {
  const edges = React.useContext(DataContext).Edges || {}

  const data = useHardMemo(() => _.map(edges, (e, Name) => ({ Name, ...e })))
  const columns: Column<Edge>[] = useHardMemo(() => [
    col('Name'),
    col('Description'),
    col('Requirements'),
  ])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Edge>({ columns, data }, useSortBy)

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    fontStyle: column.isSorted ? 'italic' : undefined,
                    background: column.isSorted ? '#ccddff' : undefined,
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    style={{ background: cell.column.isSorted ? '#ccddff44' : undefined }}
                  >
                    <TooltippedText text={cell.value} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
