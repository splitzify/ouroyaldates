import { plansRepository } from '@/repositories/plans.repository'
import type { DatePlan, CreatePlanInput, UpdatePlanInput } from '@/types'

export const plansService = {
  async getAll(): Promise<DatePlan[]> {
    return plansRepository.getAll()
  },

  async getById(id: string): Promise<DatePlan | null> {
    if (!id) return null
    return plansRepository.getById(id)
  },

  async create(userId: string, input: Omit<CreatePlanInput, 'created_by'>): Promise<DatePlan> {
    if (!input.title.trim()) throw new Error('Title is required')
    return plansRepository.create({
      ...input,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      created_by: userId,
    })
  },

  async update(id: string, input: UpdatePlanInput): Promise<void> {
    if (!id) throw new Error('Plan ID is required')
    return plansRepository.update(id, {
      ...input,
      title: input.title?.trim(),
      description: input.description?.trim() || null,
    })
  },

  async delete(id: string): Promise<void> {
    if (!id) throw new Error('Plan ID is required')
    return plansRepository.delete(id)
  },
}
