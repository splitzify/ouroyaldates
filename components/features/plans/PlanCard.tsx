import Link from 'next/link'
import type { DatePlan } from '@/types'
import { formatDateShort } from '@/types'
import PlanStatusBadge from './PlanStatusBadge'
import FadeContent from '@/components/bits/FadeContent'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'

interface Props {
  plan: DatePlan
  index?: number
}

export default function PlanCard({ plan, index = 0 }: Props) {
  const locationCount = (plan.locations as unknown as { id: string }[])?.length ?? 0

  return (
    <FadeContent duration={600} delay={index * 80} threshold={0.05} blur>
      <Link
        href={`/plans/${plan.id}`}
        className="group block bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-md hover:shadow-rose-100/50 transition-all duration-200 p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <PlanStatusBadge status={plan.status} />
            </div>
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-rose-700 transition-colors">
              {plan.title}
            </h3>
            {plan.description && (
              <p className="text-sm text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{plan.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-400">
              {plan.planned_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateShort(plan.planned_date)}
                </span>
              )}
              {locationCount > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locationCount} spot{locationCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-400 transition-colors flex-shrink-0 mt-1" />
        </div>
      </Link>
    </FadeContent>
  )
}
