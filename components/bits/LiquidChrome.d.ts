import type { CSSProperties } from 'react'
export interface LiquidChromeProps {
  baseColor?:   [number, number, number]
  speed?:       number
  amplitude?:   number
  frequencyX?:  number
  frequencyY?:  number
  interactive?: boolean
  className?:   string
  style?:       CSSProperties
}
export declare function LiquidChrome(props: LiquidChromeProps): JSX.Element
export default LiquidChrome
