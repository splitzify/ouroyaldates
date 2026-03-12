import type { CSSProperties, ReactNode } from 'react'
export interface FadeContentProps {
  children:                 ReactNode
  container?:               string | null
  blur?:                    boolean
  duration?:                number
  ease?:                    string
  delay?:                   number
  threshold?:               number
  initialOpacity?:          number
  disappearAfter?:          number
  disappearDuration?:       number
  disappearEase?:           string
  onComplete?:              () => void
  onDisappearanceComplete?: () => void
  className?:               string
  style?:                   CSSProperties
}
declare function FadeContent(props: FadeContentProps): JSX.Element
export default FadeContent
