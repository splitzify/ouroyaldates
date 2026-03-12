'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePlan } from '@/hooks/usePlans'
import { useLocations } from '@/hooks/useLocations'
import type { PlanStatus } from '@/types'
import { formatDate } from '@/types'
import PlanStatusBadge from '@/components/features/plans/PlanStatusBadge'
import PlanForm from '@/components/features/plans/PlanForm'
import LocationList from '@/components/features/locations/LocationList'
import AddLocationDialog from '@/components/features/locations/AddLocationDialog'
import AnimatedContent from '@/components/bits/AnimatedContent'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Plus, Calendar, Heart, MapPin } from 'lucide-react'

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const { plan, loading: planLoading, updatePlan, deletePlan } = usePlan(id)
  const { locations, loading: locsLoading, addLocation, removeLocation } = useLocations(id)

  const [editing, setEditing]         = useState(false)
  const [showAddLoc, setShowAddLoc]   = useState(false)

  async function handleSave(data: { title: string; description: string; planned_date: string; status: PlanStatus }) {
    await updatePlan({
      title:        data.title,
      description:  data.description || null,
      planned_date: data.planned_date || null,
      status:       data.status,
    })
    setEditing(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this plan? This cannot be undone.')) return
    await deletePlan()
    router.push('/dashboard')
  }

  if (planLoading) {
    return (
      <div className="flex justify-center py-20">
        <Heart className="w-8 h-8 text-rose-300 fill-rose-300 animate-pulse" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-gray-500">Plan not found.</p>
        <Button asChild variant="outline"><Link href="/dashboard">Back home</Link></Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <AnimatedContent distance={20} direction="vertical" duration={0.4}>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="-ml-2">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">{plan.title}</h1>
          <button
            onClick={() => setEditing(!editing)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${editing ? 'bg-rose-100 text-rose-500' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </AnimatedContent>

      {/* Plan info / edit form */}
      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.05}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {editing ? (
            <PlanForm
              plan={plan}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <PlanStatusBadge status={plan.status} size="md" />
                {plan.planned_date && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    {formatDate(plan.planned_date)}
                  </span>
                )}
              </div>
              {plan.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
              )}
            </div>
          )}
        </div>
      </AnimatedContent>

      {/* Locations */}
      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.1}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <h2 className="font-semibold text-gray-800">Spots</h2>
              {!locsLoading && locations.length > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {locations.length}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddLoc(true)}
              className="gap-1.5 border-rose-200 text-rose-500 hover:bg-rose-50 h-8 px-3 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add spot
            </Button>
          </div>

          {locsLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin" />
            </div>
          ) : (
            <LocationList locations={locations} onDelete={removeLocation} />
          )}
        </div>
      </AnimatedContent>

      <AddLocationDialog
        open={showAddLoc}
        onClose={() => setShowAddLoc(false)}
        onAdd={addLocation}
      />
    </div>
  )
}
