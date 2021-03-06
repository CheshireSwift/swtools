import _ from 'lodash'
import * as React from 'react'
import { Column, useSortBy, useTable, Cell } from 'react-table'
import { DataContext, Edge } from '../data'
import TooltippedText from '../TooltippedText'
import { StyleSheet, css } from 'aphrodite'

const col = (name: string) => ({ Header: name, accessor: name.toLowerCase() })
const useHardMemo = (f: () => any[]) => React.useMemo(f, [])

const colors = {
  heavyHighlight: '#ccddff',
  lightHighlight: '#ccddff44',
}
const styles = StyleSheet.create({
  // table
  table: {
    borderSpacing: 0,
  },

  // cols
  headerColHighlight: {
    fontStyle: 'italic',
    background: colors.heavyHighlight,
  },
  cellColHighlight: {
    background: colors.lightHighlight,
  },

  // rows
  row: {
    ':hover': {
      background: colors.lightHighlight,
    },
  },
  marked: {
    background: colors.heavyHighlight,
  },

  // cells
  cell: { padding: '0.25em', borderBottom: '0.5px solid lightgray' },

  // other
  nameCell: {
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
})

const CellBody = ({ cell }: { cell: Cell<Edge> }) => {
  switch (cell.column.Header) {
    case 'Requirements':
      return cell.value.map((req: string) => (
        <div key={req}>
          <TooltippedText>{req}</TooltippedText>
        </div>
      ))
    case 'Name':
      return (
        <div className={css(styles.nameCell)}>
          <TooltippedText>{cell.value}</TooltippedText>
          {cell.row.original.duplicated && (
            <span style={{ color: 'gray' }} title={cell.row.original.source}>
              *
            </span>
          )}
        </div>
      )
    default:
      return (
        <>
          <TooltippedText>{cell.value}</TooltippedText>
        </>
      )
  }
}

export const Edges = () => {
  const edges = React.useContext(DataContext).edges || []
  const [selectedRow, setSelectedRow] = React.useState<string>()

  const data = useHardMemo(() => edges)
  const columns: Column<Edge>[] = useHardMemo(() => [
    col('Name'),
    col('Description'),
    col('Requirements'),
    col('Source'),
  ])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Edge>(
    { columns, data },
    useSortBy,
  )

  return (
    <table {...getTableProps()} className={css(styles.table)}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={css(styles.cell, column.isSorted && styles.headerColHighlight)}
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
            <tr
              {...row.getRowProps()}
              onClick={() => {
                setSelectedRow(row.id)
              }}
              className={css(styles.row, selectedRow === row.id && styles.marked)}
            >
              {row.cells.map(cell => (
                <td
                  {...cell.getCellProps()}
                  className={css(styles.cell, cell.column.isSorted && styles.cellColHighlight)}
                >
                  <CellBody cell={cell} />
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
