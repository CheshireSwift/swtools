import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import * as React from 'react'
import replaceToArray from 'string-replace-to-array'

interface EntryDisplayProps {
  name: string
}
const AttributeDisplay = ({ name }: EntryDisplayProps) => <>{'Attribute: ' + name}</>
const ConditionDisplay = ({ name }: { name: string }) => <>{'Condition: ' + name}</>
const EdgeDisplay = ({ name }: { name: string }) => <>{'Edge: ' + name}</>
const ManeuverDisplay = ({ name }: { name: string }) => <>{'Maneuver: ' + name}</>
const RankDisplay = ({ name }: { name: string }) => <>{'Rank: ' + name}</>
const SkillDisplay = ({ name }: { name: string }) => <>{'Skill: ' + name}</>

type EntryTypeInfo = {
  type: string
  url: string
  element: (name: string) => React.ReactElement
}

const typeByMarker = {
  a: {
    type: 'Attribute',
    url: 'attribute',
    element: name => <AttributeDisplay name={name} />,
  } as EntryTypeInfo,
  c: {
    type: 'Condition',
    url: 'condition',
    element: name => <ConditionDisplay name={name} />,
  } as EntryTypeInfo,
  e: {
    type: 'Edge',
    url: 'edge',
    element: name => <EdgeDisplay name={name} />,
  } as EntryTypeInfo,
  m: {
    type: 'Maneuver',
    url: 'maneuver',
    element: name => <ManeuverDisplay name={name} />,
  } as EntryTypeInfo,
  r: {
    type: 'Rank',
    url: 'rank',
    element: name => <RankDisplay name={name} />,
  } as EntryTypeInfo,
  s: {
    type: 'Skill',
    url: 'skill',
    element: name => <SkillDisplay name={name} />,
  } as EntryTypeInfo,
}

const anyKnownTypeMarker = Object.keys(typeByMarker).join('|')
const markedText = /\w+(?: [A-Z]\w+)*/.source
const tagMatcher = new RegExp(`(${anyKnownTypeMarker}):(${markedText})`, 'g')

const tooltipper = () => {
  let i = 0
  return (_match: string, marker: keyof typeof typeByMarker, name: string): React.ReactElement => (
    <Tooltip key={i++} overlay={typeByMarker[marker].element(name)} placement="bottom" trigger="hover">
      <a href={'../' + typeByMarker[marker].url + '/#' + name} style={{ fontWeight: 'bold' }}>
        {name}
      </a>
    </Tooltip>
  )
}

export const TooltippedText = ({ children }: { children: string }) => (
  <>{replaceToArray(children, tagMatcher, tooltipper())}</>
)

export default TooltippedText
