import { createClient } from '@/lib/supabase'
import type { DatePlan, CreatePlanInput, UpdatePlanInput } from '@/types'

export const plansRepository = {
  async getAll(): Promise<DatePlan[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('date_plans')
      .select('*, locations(id)')
      .order('planned_date', { ascending: true, nullsFirst: false })
    if (error) throw error
    return data ?? []
  },

  async getById(id: string): Promise<DatePlan | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('date_plans')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  },

  async create(input: CreatePlanInput): Promise<DatePlan> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('date_plans')
      .insert(input)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, input: UpdatePlanInput): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('date_plans')
      .update(input)
      .eq('id', id)
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('date_plans')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
