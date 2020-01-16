import { css, StyleSheet } from 'aphrodite'
import * as React from 'react'
import { Cell, Column, useSortBy, useTable } from 'react-table'
import { DataContext, Item } from '../data'
import TooltippedText from '../TooltippedText'

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
  cell: { padding: '0.25em', borderBottom: '0.5px solid lightgray', whiteSpace: 'nowrap' },

  // other
  nameCell: {
    fontWeight: 'bold',
  },

  wrap: {
    whiteSpace: 'normal',
  },
})

const CellBody = ({ cell }: { cell: Cell<Item> }) => {
  switch (cell.column.Header) {
    case 'Name':
      return (
        <div className={css(styles.nameCell)}>
          <TooltippedText>{cell.value}</TooltippedText>
        </div>
      )
    case 'Notes':
    case 'Weight':
      return (
        <div className={css(styles.wrap)}>
          <TooltippedText>{cell.value}</TooltippedText>
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

export const Items = () => {
  const items = React.useContext(DataContext).items || []
  const [selectedRow, setSelectedRow] = React.useState<string>()

  const data = useHardMemo(() => items)
  const columns: Column<Item>[] = useHardMemo(() => [
    col('Name'),
    col('Cost'),
    col('Weight'),
    col('Category'),
    { Header: 'Notes', accessor: (item: Item) => item.notes || '' },
  ])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Item>(
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
