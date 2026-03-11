'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { DatePlan, PlanStatus } from '@/lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, Calendar, ChevronRight, Heart } from 'lucide-react'

const FILTERS: { label: string; value: PlanStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Wishlist', value: 'wishlist' },
  { label: 'Planned', value: 'planned' },
  { label: 'Done', value: 'done' },
]

export default function DashboardPage() {
  const [plans, setPlans] = useState<DatePlan[]>([])
  const [filter, setFilter] = useState<PlanStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  const fetchPlans = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('date_plans')
      .select('*, locations(id)')
      .order('planned_date', { ascending: true, nullsFirst: false })
    setPlans(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPlans()
    const supabase = createClient()
    const channel = supabase
      .channel('dashboard-plans')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_plans' }, fetchPlans)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchPlans])

  const filtered = filter === 'all' ? plans : plans.filter(p => p.status === filter)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Heart className="w-8 h-8 text-rose-300 fill-rose-300 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-600 border hover:border-rose-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Heart className="w-12 h-12 text-rose-200 fill-rose-200 mx-auto" />
          <p className="text-gray-500">No plans yet. Add your first date idea!</p>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/plans/new">
              <Plus className="w-4 h-4 mr-1" />
              New plan
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(plan => (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="block bg-white rounded-xl border hover:border-rose-300 hover:shadow-sm transition-all p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className={`text-xs font-medium ${STATUS_COLORS[plan.status]}`} variant="outline">
                      {STATUS_LABELS[plan.status]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{plan.title}</h3>
                  {plan.description && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{plan.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {plan.planned_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(plan.planned_date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    )}
                    {(plan.locations as unknown as { id: string }[])?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {(plan.locations as unknown as { id: string }[]).length} location
                        {(plan.locations as unknown as { id: string }[]).length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
