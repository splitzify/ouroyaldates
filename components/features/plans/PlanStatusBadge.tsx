import type { PlanStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

interface Props {
  status: PlanStatus
  size?: 'sm' | 'md'
}

export default function PlanStatusBadge({ status, size = 'sm' }: Props) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${STATUS_COLORS[status]}
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}
      `}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
