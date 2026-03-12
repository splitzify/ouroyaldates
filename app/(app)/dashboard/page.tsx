'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePlans } from '@/hooks/usePlans'
import { useAuth } from '@/hooks/useAuth'
import type { PlanStatus } from '@/types'
import { getDisplayName } from '@/types'
import PlanCard from '@/components/features/plans/PlanCard'
import PlanFilterTabs from '@/components/features/plans/PlanFilterTabs'
import AnimatedContent from '@/components/bits/AnimatedContent'
import { Button } from '@/components/ui/button'
import { Heart, Plus } from 'lucide-react'

type FilterValue = PlanStatus | 'all'

export default function DashboardPage() {
  const { plans, loading } = usePlans()
  const { user } = useAuth()
  const [filter, setFilter] = useState<FilterValue>('all')

  const rawName     = user?.user_metadata?.display_name || user?.email || ''
  const displayName = rawName ? getDisplayName(rawName) : null

  const counts: Record<FilterValue, number> = {
    all:      plans.length,
    wishlist: plans.filter(p => p.status === 'wishlist').length,
    planned:  plans.filter(p => p.status === 'planned').length,
    done:     plans.filter(p => p.status === 'done').length,
  }

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
      <AnimatedContent distance={20} direction="vertical" duration={0.5}>
        <div className="flex items-end justify-between">
          <div>
            {displayName && (
              <p className="text-sm text-rose-400 font-medium mb-0.5">Hi, {displayName} 💕</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Our dates</h1>
            <p className="text-sm text-gray-400 mt-0.5">{plans.length} plan{plans.length !== 1 ? 's' : ''} together</p>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={15} direction="vertical" duration={0.5} delay={0.05}>
        <PlanFilterTabs active={filter} onChange={setFilter} counts={counts} />
      </AnimatedContent>

      {filtered.length === 0 ? (
        <AnimatedContent distance={20} direction="vertical" duration={0.5} delay={0.1}>
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-rose-300 fill-rose-200" />
            </div>
            <div>
              <p className="font-medium text-gray-700">No plans yet</p>
              <p className="text-sm text-gray-400 mt-0.5">Add your first date idea!</p>
            </div>
            <Button asChild className="btn-primary">
              <Link href="/plans/new">
                <Plus className="w-4 h-4 mr-1.5" />
                New plan
              </Link>
            </Button>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-3">
          {filtered.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
