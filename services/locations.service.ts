import { locationsRepository } from '@/repositories/locations.repository'
import { detectPlatform } from '@/types'
import type { Location } from '@/types'

export const locationsService = {
  async getByPlanId(planId: string): Promise<Location[]> {
    return locationsRepository.getByPlanId(planId)
  },

  async add(planId: string, input: { name: string; url: string; notes?: string }, currentCount: number): Promise<Location> {
    if (!input.name.trim()) throw new Error('Name is required')
    if (!input.url.trim()) throw new Error('URL is required')

    const platform = detectPlatform(input.url)
    return locationsRepository.create({
      plan_id:    planId,
      name:       input.name.trim(),
      url:        input.url.trim(),
      notes:      input.notes?.trim() || undefined,
      platform,
      sort_order: currentCount,
    })
  },

  async update(id: string, input: { name: string; url: string; notes?: string }): Promise<Location> {
    if (!input.name.trim()) throw new Error('Name is required')
    if (!input.url.trim())  throw new Error('URL is required')
    const platform = detectPlatform(input.url)
    return locationsRepository.update(id, {
      name:     input.name.trim(),
      url:      input.url.trim(),
      notes:    input.notes?.trim() || null,
      platform,
    })
  },

  async remove(id: string): Promise<void> {
    return locationsRepository.delete(id)
  },
}
