'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { plansService } from '@/services/plans.service'
import type { DatePlan, PlanStatus } from '@/types'

export function usePlans() {
  const [plans, setPlans]     = useState<DatePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      const data = await plansService.getAll()
      setPlans(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const supabase = createClient()
    const channel = supabase
      .channel('plans-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_plans' }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetch])

  return { plans, loading, error, refetch: fetch }
}

export function usePlan(id: string) {
  const [plan, setPlan]       = useState<DatePlan | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const data = await plansService.getById(id)
    setPlan(data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetch()
    const supabase = createClient()
    const channel = supabase
      .channel(`plan-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_plans', filter: `id=eq.${id}` }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetch, id])

  async function updatePlan(input: { title: string; description?: string | null; planned_date?: string | null; status: PlanStatus }) {
    await plansService.update(id, input)
    fetch()
  }

  async function deletePlan() {
    await plansService.delete(id)
  }

  return { plan, loading, updatePlan, deletePlan, refetch: fetch }
}
