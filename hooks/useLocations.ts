'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { locationsService } from '@/services/locations.service'
import type { Location } from '@/types'

export function useLocations(planId: string) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading]     = useState(true)

  const fetch = useCallback(async () => {
    const data = await locationsService.getByPlanId(planId)
    setLocations(data)
    setLoading(false)
  }, [planId])

  useEffect(() => {
    fetch()
    const supabase = createClient()
    const channel = supabase
      .channel(`locations-${planId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations', filter: `plan_id=eq.${planId}` }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetch, planId])

  async function addLocation(input: { name: string; url: string; notes?: string }) {
    await locationsService.add(planId, input, locations.length)
    fetch()
  }

  async function removeLocation(id: string) {
    await locationsService.remove(id)
    fetch()
  }

  return { locations, loading, addLocation, removeLocation, refetch: fetch }
}
