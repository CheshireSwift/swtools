import _ from 'lodash'
import * as React from 'react'
import { Column, useTable } from 'react-table'
import { DataContext, Edge } from '../data'
import TooltippedText from '../TooltippedText'

const col = (name: string) => ({ Header: name, accessor: name })
export const Edges = () => {
  const edges = React.useContext(DataContext).Edges || {}
  const data = React.useMemo(
    () => _.map(edges, (e, Name) => ({ Name, ...e })),
    [],
  )
  const columns: Column<Edge>[] = React.useMemo(
    () => [col('Name'), col('Description'), col('Requirements')],
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Edge>({ columns, data })

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      <TooltippedText text={cell.value} />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
