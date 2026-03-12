'use client'

import { useState } from 'react'
import { detectPlatform, PLATFORM_LABELS } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import AnimatedContent from '@/components/bits/AnimatedContent'
import { MapPin, Instagram, Music2, Star, Link as LinkIcon, Sparkles } from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  maps:      <MapPin      className="w-4 h-4 text-emerald-500" />,
  instagram: <Instagram   className="w-4 h-4 text-pink-500" />,
  tiktok:    <Music2      className="w-4 h-4 text-gray-700" />,
  yelp:      <Star        className="w-4 h-4 text-red-500" />,
  other:     <LinkIcon    className="w-4 h-4 text-gray-400" />,
}

interface Props {
  open:    boolean
  onClose: () => void
  onAdd:   (data: { name: string; url: string; notes?: string }) => Promise<void>
}

export default function AddLocationDialog({ open, onClose, onAdd }: Props) {
  const [name, setName]     = useState('')
  const [url, setUrl]       = useState('')
  const [notes, setNotes]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const detectedPlatform = url ? detectPlatform(url) : null

  function reset() {
    setName(''); setUrl(''); setNotes(''); setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onAdd({ name, url, notes: notes || undefined })
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add location')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="max-w-sm rounded-2xl gap-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 px-6 pt-5 pb-4">
          <DialogHeader>
            <DialogTitle className="text-white font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Add a spot
            </DialogTitle>
          </DialogHeader>
          <p className="text-rose-100 text-xs mt-1">Paste any link — maps, instagram, tiktok, yelp…</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="loc-url" className="label-style">Link *</Label>
            <div className="relative">
              <Input
                id="loc-url"
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
            <Label htmlFor="loc-name" className="label-style">Name *</Label>
            <Input
              id="loc-name"
              placeholder="e.g. Sunset Point, Little Italy"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-style"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loc-notes" className="label-style">Notes <span className="text-gray-400">(optional)</span></Label>
            <Input
              id="loc-notes"
              placeholder="Bring a blanket, call ahead…"
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
              {loading ? 'Adding…' : 'Add spot'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
