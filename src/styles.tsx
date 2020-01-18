import { StyleSheet } from 'aphrodite'

export const colors = {
  heavyHighlight: 'rgb(234, 199, 184)',
  lightHighlight: 'rgba(234, 199, 184, 0.5)',
}

export const tableStyles = StyleSheet.create({
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
      background: colors.heavyHighlight,
    },
  },
  marked: {
    background: colors.lightHighlight,
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
