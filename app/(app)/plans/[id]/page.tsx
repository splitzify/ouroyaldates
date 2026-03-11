'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { DatePlan, Location, PlanStatus } from '@/lib/types'
import { detectPlatform, STATUS_LABELS, STATUS_COLORS, PLATFORM_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  ArrowLeft, Plus, Trash2, ExternalLink, MapPin, Instagram, Music2,
  Star, Link as LinkIcon, Pencil, Check, X, Calendar,
} from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  maps: <MapPin className="w-4 h-4 text-green-600" />,
  instagram: <Instagram className="w-4 h-4 text-pink-600" />,
  tiktok: <Music2 className="w-4 h-4 text-black" />,
  yelp: <Star className="w-4 h-4 text-red-500" />,
  other: <LinkIcon className="w-4 h-4 text-gray-500" />,
}

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [plan, setPlan] = useState<DatePlan | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  // Edit state
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editStatus, setEditStatus] = useState<PlanStatus>('wishlist')

  // Add location dialog
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [locName, setLocName] = useState('')
  const [locUrl, setLocUrl] = useState('')
  const [locNotes, setLocNotes] = useState('')
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError] = useState('')

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const [planRes, locRes] = await Promise.all([
      supabase.from('date_plans').select('*').eq('id', id).single(),
      supabase.from('locations').select('*').eq('plan_id', id).order('sort_order'),
    ])
    if (planRes.data) {
      setPlan(planRes.data)
      setEditTitle(planRes.data.title)
      setEditDesc(planRes.data.description ?? '')
      setEditDate(planRes.data.planned_date ?? '')
      setEditStatus(planRes.data.status)
    }
    if (locRes.data) setLocations(locRes.data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchData()
    const supabase = createClient()
    const channel = supabase
      .channel(`plan-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_plans', filter: `id=eq.${id}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations', filter: `plan_id=eq.${id}` }, fetchData)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchData, id])

  async function savePlan() {
    const supabase = createClient()
    await supabase.from('date_plans').update({
      title: editTitle,
      description: editDesc || null,
      planned_date: editDate || null,
      status: editStatus,
    }).eq('id', id)
    setEditing(false)
    fetchData()
  }

  async function deletePlan() {
    if (!confirm('Delete this plan? This cannot be undone.')) return
    const supabase = createClient()
    await supabase.from('date_plans').delete().eq('id', id)
    router.push('/dashboard')
  }

  async function addLocation(e: React.FormEvent) {
    e.preventDefault()
    setLocError('')
    setLocLoading(true)
    const supabase = createClient()
    const platform = detectPlatform(locUrl)
    const { error } = await supabase.from('locations').insert({
      plan_id: id,
      name: locName,
      url: locUrl,
      platform,
      notes: locNotes || null,
      sort_order: locations.length,
    })
    if (error) {
      setLocError(error.message)
      setLocLoading(false)
    } else {
      setLocName(''); setLocUrl(''); setLocNotes('')
      setShowAddLocation(false)
      setLocLoading(false)
      fetchData()
    }
  }

  async function deleteLocation(locId: string) {
    const supabase = createClient()
    await supabase.from('locations').delete().eq('id', locId)
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-rose-300 border-t-rose-600 animate-spin" />
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
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2">
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-xl font-bold flex-1 truncate">{plan.title}</h1>
        <Button variant="ghost" size="icon" onClick={() => setEditing(!editing)}>
          <Pencil className="w-4 h-4 text-gray-500" />
        </Button>
      </div>

      {/* Plan details card */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        {editing ? (
          <>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={v => setEditStatus(v as PlanStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wishlist">Wishlist</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={savePlan} className="bg-rose-500 hover:bg-rose-600 gap-1">
                <Check className="w-4 h-4" /> Save
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="gap-1">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button variant="ghost" onClick={deletePlan} className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Badge className={`${STATUS_COLORS[plan.status]}`} variant="outline">
                {STATUS_LABELS[plan.status]}
              </Badge>
              {plan.planned_date && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(plan.planned_date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </span>
              )}
            </div>
            {plan.description && (
              <p className="text-gray-600 text-sm">{plan.description}</p>
            )}
          </>
        )}
      </div>

      {/* Locations section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Locations</h2>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => setShowAddLocation(true)}
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        {locations.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed p-8 text-center">
            <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No locations yet — add a Google Maps link, Instagram post, or anything!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {locations.map(loc => (
              <div key={loc.id} className="bg-white rounded-xl border p-4 flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {PLATFORM_ICONS[loc.platform] ?? PLATFORM_ICONS.other}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{loc.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{PLATFORM_LABELS[loc.platform as keyof typeof PLATFORM_LABELS]}</span>
                  </div>
                  {loc.notes && (
                    <p className="text-xs text-gray-500 mt-0.5">{loc.notes}</p>
                  )}
                  <a
                    href={loc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-rose-500 hover:underline flex items-center gap-0.5 mt-1 truncate"
                  >
                    Open link <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                <button
                  onClick={() => deleteLocation(loc.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Location Dialog */}
      <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a location</DialogTitle>
          </DialogHeader>
          <form onSubmit={addLocation} className="space-y-4">
            {locError && (
              <p className="text-sm text-red-600 bg-red-50 rounded p-2">{locError}</p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="loc-name">Name *</Label>
              <Input
                id="loc-name"
                placeholder="e.g. Sunset Point, Italian restaurant"
                value={locName}
                onChange={e => setLocName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-url">Link *</Label>
              <Input
                id="loc-url"
                type="url"
                placeholder="Google Maps, Instagram, TikTok, Yelp…"
                value={locUrl}
                onChange={e => setLocUrl(e.target.value)}
                required
              />
              {locUrl && (
                <p className="text-xs text-gray-400">
                  Detected: {PLATFORM_LABELS[detectPlatform(locUrl)]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-notes">Notes</Label>
              <Input
                id="loc-notes"
                placeholder="Optional note about this spot"
                value={locNotes}
                onChange={e => setLocNotes(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddLocation(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={locLoading}>
                {locLoading ? 'Adding…' : 'Add location'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
