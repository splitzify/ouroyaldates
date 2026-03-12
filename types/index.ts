// ─── Domain types ────────────────────────────────────────────────────────────

export type PlanStatus = 'wishlist' | 'planned' | 'done'
export type Platform   = 'maps' | 'instagram' | 'tiktok' | 'yelp' | 'other'

export interface DatePlan {
  id:           string
  title:        string
  description:  string | null
  planned_date: string | null
  status:       PlanStatus
  created_by:   string
  created_at:   string
  updated_at:   string
  locations?:   Location[]
}

export interface Location {
  id:         string
  plan_id:    string
  name:       string
  url:        string
  platform:   Platform
  notes:      string | null
  sort_order: number
}

export interface CreatePlanInput {
  title:        string
  description?: string
  planned_date?: string
  status:       PlanStatus
  created_by:   string
}

export interface UpdatePlanInput {
  title?:        string
  description?:  string | null
  planned_date?: string | null
  status?:       PlanStatus
}

export interface CreateLocationInput {
  plan_id:    string
  name:       string
  url:        string
  notes?:     string
  sort_order: number
}

// ─── Display maps ────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<PlanStatus, string> = {
  wishlist: 'Wishlist',
  planned:  'Planned',
  done:     'Done',
}

export const STATUS_COLORS: Record<PlanStatus, string> = {
  wishlist: 'bg-purple-100 text-purple-700 border-purple-200',
  planned:  'bg-blue-100 text-blue-700 border-blue-200',
  done:     'bg-emerald-100 text-emerald-700 border-emerald-200',
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  maps:      'Google Maps',
  instagram: 'Instagram',
  tiktok:    'TikTok',
  yelp:      'Yelp',
  other:     'Link',
}

// ─── Utils ───────────────────────────────────────────────────────────────────

export function detectPlatform(url: string): Platform {
  try {
    const lower = url.toLowerCase()
    if (lower.includes('maps.google') || lower.includes('goo.gl/maps') || lower.includes('maps.app.goo.gl')) return 'maps'
    if (lower.includes('instagram.com')) return 'instagram'
    if (lower.includes('tiktok.com'))    return 'tiktok'
    if (lower.includes('yelp.com'))      return 'yelp'
  } catch {}
  return 'other'
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
