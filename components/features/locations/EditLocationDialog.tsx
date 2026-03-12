'use client'

import { useState, useEffect } from 'react'
import { detectPlatform, PLATFORM_LABELS } from '@/types'
import type { Location } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import AnimatedContent from '@/components/bits/AnimatedContent'
import { MapPin, Instagram, Music2, Star, Link as LinkIcon, Pencil } from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  maps:      <MapPin      className="w-4 h-4 text-emerald-500" />,
  instagram: <Instagram   className="w-4 h-4 text-pink-500" />,
  tiktok:    <Music2      className="w-4 h-4 text-gray-700" />,
  yelp:      <Star        className="w-4 h-4 text-red-500" />,
  other:     <LinkIcon    className="w-4 h-4 text-gray-400" />,
}

interface Props {
  open:       boolean
  location:   Location | null
  onClose:    () => void
  onSave:     (id: string, data: { name: string; url: string; notes?: string }) => Promise<void>
}

export default function EditLocationDialog({ open, location, onClose, onSave }: Props) {
  const [name, setName]       = useState('')
  const [url, setUrl]         = useState('')
  const [notes, setNotes]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location) {
      setName(location.name)
      setUrl(location.url)
      setNotes(location.notes ?? '')
      setError('')
    }
  }, [location])

  const detectedPlatform = url ? detectPlatform(url) : null

  function reset() {
    setName(''); setUrl(''); setNotes(''); setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location) return
    setError('')
    setLoading(true)
    try {
      await onSave(location.id, { name, url, notes: notes || undefined })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="max-w-sm rounded-2xl gap-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 px-6 pt-5 pb-4">
          <DialogHeader>
            <DialogTitle className="text-white font-bold flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit spot
            </DialogTitle>
          </DialogHeader>
          <p className="text-violet-100 text-xs mt-1">Update the details for this spot.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="edit-url" className="label-style">Link *</Label>
            <div className="relative">
              <Input
                id="edit-url"
                type="url"
                placeholder="https://maps.google.com/…"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="input-style pr-10"
                required
              />
              {detectedPlatform && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {PLATFORM_ICONS[detectedPlatform]}
                </span>
              )}
            </div>
            {detectedPlatform && (
              <AnimatedContent distance={10} direction="vertical" duration={0.3}>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  Detected: <span className="font-medium text-gray-600">{PLATFORM_LABELS[detectedPlatform]}</span>
                </p>
              </AnimatedContent>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="label-style">Name *</Label>
            <Input
              id="edit-name"
              placeholder="e.g. Sunset Point"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-notes" className="label-style">Notes <span className="text-gray-400">(optional)</span></Label>
            <Input
              id="edit-notes"
              placeholder="Any tips or reminders…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input-style"
            />
          </div>

          <DialogFooter className="pt-1 gap-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
