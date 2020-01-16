import * as React from 'react'
import ReactDOM from 'react-dom'

export const Title = ({ children }: { children: React.ReactChild }) => {
  const titleNode = document.getElementById('title')
  if (!titleNode) {
    return null
  }

  return ReactDOM.createPortal(children, titleNode)
}

export default Title
