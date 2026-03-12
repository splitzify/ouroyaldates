import Link from 'next/link'
import type { DatePlan } from '@/types'
import { formatDateShort, formatTime, buildCalendarUrl, STATUS_STAR_COLORS } from '@/types'
import PlanStatusBadge from './PlanStatusBadge'
import FadeContent from '@/components/bits/FadeContent'
import StarBorder from '@/components/bits/StarBorder'
import { Calendar, MapPin, ChevronRight, CalendarPlus, Clock, User, Pencil } from 'lucide-react'

interface Props {
  plan: DatePlan
  index?: number
}

export default function PlanCard({ plan, index = 0 }: Props) {
  const locationCount = (plan.locations as unknown as { id: string }[])?.length ?? 0
  const calUrl = buildCalendarUrl(plan)

  return (
    <FadeContent duration={600} delay={index * 80} threshold={0.05} blur>
      <StarBorder
        as="div"
        color={STATUS_STAR_COLORS[plan.status]}
        speed="8s"
        thickness={1}
        className="plan-star-border rounded-2xl w-full"
      >
        <Link
          href={`/plans/${plan.id}`}
          className="group block bg-white rounded-2xl hover:shadow-md hover:shadow-rose-100/50 transition-all duration-200 p-4"
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

              {/* Date, time, spots row */}
              <div className="flex items-center flex-wrap gap-3 mt-2.5 text-xs text-gray-400">
                {plan.planned_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateShort(plan.planned_date)}
                  </span>
                )}
                {plan.planned_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(plan.planned_time)}
                  </span>
                )}
                {locationCount > 0 && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {locationCount} spot{locationCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Creator / last edited row */}
              <div className="flex items-center flex-wrap gap-3 mt-1 text-xs text-gray-300">
                {plan.creator_name && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {plan.creator_name}
                  </span>
                )}
                {plan.updated_by_name && (
                  <span className="flex items-center gap-1">
                    <Pencil className="w-3 h-3" />
                    edited by {plan.updated_by_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {calUrl && (
                <a
                  href={calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  title="Add to Google Calendar"
                  className="text-gray-300 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-50"
                >
                  <CalendarPlus className="w-4 h-4" />
                </a>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-400 transition-colors" />
            </div>
          </div>
        </Link>
      </StarBorder>
    </FadeContent>
  )
}
