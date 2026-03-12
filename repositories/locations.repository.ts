import { createClient } from '@/lib/supabase'
import type { Location, CreateLocationInput } from '@/types'

export const locationsRepository = {
  async getByPlanId(planId: string): Promise<Location[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('plan_id', planId)
      .order('sort_order')
    if (error) throw error
    return data ?? []
  },

  async create(input: CreateLocationInput & { platform: string }): Promise<Location> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('locations')
      .insert(input)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
