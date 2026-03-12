// ─── Domain types ────────────────────────────────────────────────────────────

export type PlanStatus = 'wishlist' | 'planned' | 'done'
export type Platform   = 'maps' | 'instagram' | 'tiktok' | 'yelp' | 'other'

export interface DatePlan {
  id:               string
  title:            string
  description:      string | null
  planned_date:     string | null
  planned_time:     string | null
  status:           PlanStatus
  created_by:       string
  creator_name:     string | null
  updated_by_name:  string | null
  created_at:       string
  updated_at:       string
  locations?:       Location[]
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
  title:           string
  description?:    string
  planned_date?:   string
  planned_time?:   string
  status:          PlanStatus
  created_by:      string
  creator_name?:   string
}

export interface UpdatePlanInput {
  title?:           string
  description?:     string | null
  planned_date?:    string | null
  planned_time?:    string | null
  status?:          PlanStatus
  updated_by_name?: string | null
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

// Star border glow colors per status
export const STATUS_STAR_COLORS: Record<PlanStatus, string> = {
  wishlist: '#9333ea',
  planned:  '#3b82f6',
  done:     '#10b981',
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

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/** Map a raw display name to the app nickname */
export function getDisplayName(rawName: string): string {
  const lower = rawName.toLowerCase()
  if (lower.includes('pamela')) return 'Princess P'
  if (lower.includes('ian'))    return 'Sir Knight'
  return rawName
}

/** Build a Google Calendar "Add to Calendar" URL for a plan */
export function buildCalendarUrl(plan: DatePlan): string | null {
  if (!plan.planned_date) return null
  const d       = plan.planned_date.replace(/-/g, '')
  const title   = encodeURIComponent(plan.title)
  const details = plan.description ? encodeURIComponent(plan.description) : ''
  let dates: string
  if (plan.planned_time) {
    const [h, m] = plan.planned_time.split(':').map(Number)
    const startT = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`
    const endH   = String((h + 2) % 24).padStart(2, '0')
    const endT   = `${endH}${String(m).padStart(2, '0')}00`
    dates = `${d}T${startT}/${d}T${endT}`
  } else {
    const dt = new Date(plan.planned_date + 'T00:00:00')
    dt.setDate(dt.getDate() + 1)
    const endD = dt.toISOString().slice(0, 10).replace(/-/g, '')
    dates = `${d}/${endD}`
  }
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`
}
