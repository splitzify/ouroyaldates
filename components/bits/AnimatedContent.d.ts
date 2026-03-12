import type { ReactNode } from 'react'
export interface AnimatedContentProps {
  children:                 ReactNode
  container?:               string | null
  distance?:                number
  direction?:               'vertical' | 'horizontal'
  reverse?:                 boolean
  duration?:                number
  ease?:                    string
  initialOpacity?:          number
  animateOpacity?:          boolean
  scale?:                   number
  threshold?:               number
  delay?:                   number
  disappearAfter?:          number
  disappearDuration?:       number
  disappearEase?:           string
  onComplete?:              () => void
  onDisappearanceComplete?: () => void
  className?:               string
}
declare function AnimatedContent(props: AnimatedContentProps): JSX.Element
export default AnimatedContent
