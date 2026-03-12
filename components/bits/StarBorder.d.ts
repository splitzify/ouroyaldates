import type { CSSProperties, ReactNode, ElementType } from 'react'
export interface StarBorderProps {
  as?:        ElementType
  className?: string
  color?:     string
  speed?:     string
  thickness?: number
  children?:  ReactNode
  style?:     CSSProperties
  onClick?:   () => void
}
declare function StarBorder(props: StarBorderProps): JSX.Element
export default StarBorder
