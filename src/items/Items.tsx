import { css } from 'aphrodite'
import * as React from 'react'
import { Cell, Column, useSortBy, useTable } from 'react-table'
import { DataContext, Item } from '../data'
import TooltippedText from '../TooltippedText'
import { tableStyles } from '../styles'
import _ from 'lodash'

const col = (name: string) => ({ Header: name, accessor: name.toLowerCase() })
const useHardMemo = (f: () => any[]) => React.useMemo(f, [])

const Notes = ({ notes, selected }: { notes: string; selected: boolean }) =>
  selected ? (
    <div className={css(tableStyles.wrap)}>
      <TooltippedText>{notes}</TooltippedText>
    </div>
  ) : (
    <>{notes.substring(0, 50)}...</>
  )

const CellBody = ({ cell, selected }: { cell: Cell<Item>; selected: boolean }) => {
  switch (cell.column.Header) {
    case 'Name':
      return (
        <div className={css(tableStyles.nameCell)}>
          <TooltippedText>{cell.value}</TooltippedText>
        </div>
      )
    case 'Notes':
      return cell.value && <Notes notes={cell.value} selected={selected} />
    case 'Weight':
      return (
        <div className={css(tableStyles.wrap)}>
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

const useHash = (): [string, (hash: string) => void] => {
  const currentHash = () => window.location.hash.replace(/^#/, '')
  const [hash, setHash] = React.useState(currentHash())

  const handler = () => {
    setHash(currentHash())
  }

  React.useEffect(() => {
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return [
    hash,
    (value: string) => {
      window.location.hash = value
    },
  ]
}

export const Items = () => {
  // Tie URL hash to row
  const [hash, setHash] = useHash()
  const hashMatches = /^([^#~]+)(?:~(\d+))?$/.exec(hash)
  const selectedName = _.get(hashMatches, 1)
  const selectedRow = _.get(hashMatches, 2)
  const setSelectedRow = (id: string, name: string) => {
    setHash(`${name}~${id}`)
  }
  const rowRef = React.useRef<HTMLTableRowElement>(null)
  React.useEffect(() => {
    rowRef.current && rowRef.current.scrollIntoView({ block: 'nearest' })
  }, [rowRef.current])

  const items = React.useContext(DataContext).items || []

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
    <table {...getTableProps()} className={css(tableStyles.table)}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={css(tableStyles.cell, column.isSorted && tableStyles.headerColHighlight)}
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
          const rowIsSelected =
            selectedRow != null ? selectedRow === row.id : row.original.name.startsWith(selectedName || '')
          return (
            <tr
              {...row.getRowProps()}
              className={css(tableStyles.row, rowIsSelected && tableStyles.marked)}
              ref={rowIsSelected ? rowRef : null}
              onClick={() => {
                setSelectedRow(row.id, row.original.name)
              }}
            >
              {row.cells.map(cell => (
                <td
                  {...cell.getCellProps()}
                  className={css(tableStyles.cell, cell.column.isSorted && tableStyles.cellColHighlight)}
                >
                  <CellBody cell={cell} selected={rowIsSelected} />
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
