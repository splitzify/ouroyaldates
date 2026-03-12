import type { CSSProperties, ReactNode } from 'react'

// ─── FadeContent ─────────────────────────────────────────────────────────────
export interface FadeContentProps {
  children:                    ReactNode
  container?:                  string | null
  blur?:                       boolean
  duration?:                   number
  ease?:                       string
  delay?:                      number
  threshold?:                  number
  initialOpacity?:             number
  disappearAfter?:             number
  disappearDuration?:          number
  disappearEase?:              string
  onComplete?:                 () => void
  onDisappearanceComplete?:    () => void
  className?:                  string
  style?:                      CSSProperties
}
declare const FadeContent: (props: FadeContentProps) => JSX.Element
export default FadeContent

// ─── AnimatedContent ─────────────────────────────────────────────────────────
export interface AnimatedContentProps {
  children:                    ReactNode
  container?:                  string | null
  distance?:                   number
  direction?:                  'vertical' | 'horizontal'
  reverse?:                    boolean
  duration?:                   number
  ease?:                       string
  initialOpacity?:             number
  animateOpacity?:             boolean
  scale?:                      number
  threshold?:                  number
  delay?:                      number
  disappearAfter?:             number
  disappearDuration?:          number
  disappearEase?:              string
  onComplete?:                 () => void
  onDisappearanceComplete?:    () => void
  className?:                  string
}
declare const AnimatedContent: (props: AnimatedContentProps) => JSX.Element
export default AnimatedContent

// ─── AnimatedList ─────────────────────────────────────────────────────────────
export interface AnimatedListProps {
  items?:                      string[]
  onItemSelect?:               (item: string, index: number) => void
  showGradients?:              boolean
  enableArrowNavigation?:      boolean
  className?:                  string
  itemClassName?:              string
  displayScrollbar?:           boolean
  initialSelectedIndex?:       number
}
declare const AnimatedList: (props: AnimatedListProps) => JSX.Element
export default AnimatedList

// ─── LiquidChrome ────────────────────────────────────────────────────────────
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
declare const LiquidChrome: (props: LiquidChromeProps) => JSX.Element
export default LiquidChrome
