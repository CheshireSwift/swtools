import * as React from 'react'
import Tooltip from 'rc-tooltip'
import replaceToArray from 'string-replace-to-array'
import 'rc-tooltip/assets/bootstrap.css'

const typeByMarker = {
  a: 'Attribute',
  c: 'Condition',
  e: 'Edge',
  m: 'Maneuver',
  r: 'Rank',
  s: 'Skill',
}

const anyKnownTypeMarker = Object.keys(typeByMarker).join('|')
const markedText = '\\w+(?: [A-Z]\\w+)*'
const tagMatcher = new RegExp(`(${anyKnownTypeMarker}):(${markedText})`, 'g')

export const TooltippedText = ({ text }: { text: string }) => {
  return (
    <div>
      {replaceToArray(
        text,
        tagMatcher,
        (match, marker: keyof typeof typeByMarker, name) => (
          <Tooltip
            overlay={<div>{typeByMarker[marker]}</div>}
            placement="bottom"
            trigger={['hover']}
          >
            <span style={{ fontWeight: 'bold' }}>{name}</span>
          </Tooltip>
        ),
      )}
    </div>
  )
}

export default TooltippedText
