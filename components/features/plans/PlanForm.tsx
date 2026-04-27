'use client'

import { useState } from 'react'
import type { PlanStatus, DatePlan, QuestItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AnimatedContent from '@/components/bits/AnimatedContent'
import QuestList from './QuestList'
import { Check, X, Trash2, ScrollText, Swords, Gem } from 'lucide-react'

export interface PlanFormData {
  title:        string
  description:  string
  planned_date: string
  planned_time: string
  status:       PlanStatus
  objective:    string
  side_quests:  QuestItem[]
  trinkets:     QuestItem[]
}

interface Props {
  plan?: DatePlan
  onSave:   (data: PlanFormData) => Promise<void>
  onCancel?: () => void
  onDelete?: () => Promise<void>
  submitLabel?: string
}

export default function PlanForm({ plan, onSave, onCancel, onDelete, submitLabel = 'Save' }: Props) {
  const [title, setTitle]           = useState(plan?.title ?? '')
  const [description, setDesc]      = useState(plan?.description ?? '')
  const [date, setDate]             = useState(plan?.planned_date ?? '')
  const [time, setTime]             = useState(plan?.planned_time ?? '')
  const [status, setStatus]         = useState<PlanStatus>(plan?.status ?? 'wishlist')
  const [objective, setObjective]   = useState(plan?.objective ?? '')
  const [sideQuests, setSideQuests] = useState<QuestItem[]>(plan?.side_quests ?? [])
  const [trinkets, setTrinkets]     = useState<QuestItem[]>(plan?.trinkets ?? [])
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSave({
        title,
        description,
        planned_date: date,
        planned_time: time,
        status,
        objective,
        side_quests: sideQuests.filter(q => q.text.trim()),
        trinkets:    trinkets.filter(t => t.text.trim()),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
      )}

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0}>
        <div className="space-y-1.5">
          <Label htmlFor="title" className="label-style">Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Sunset picnic at the park"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input-style"
            required
          />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.05}>
        <div className="space-y-1.5">
          <Label htmlFor="description" className="label-style">Description</Label>
          <Textarea
            id="description"
            placeholder="What are you thinking?"
            value={description}
            onChange={e => setDesc(e.target.value)}
            className="input-style resize-none"
            rows={3}
          />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.1}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="date" className="label-style">Date</Label>
            {date && (
              <button type="button" onClick={() => setDate('')} className="text-xs text-gray-400 hover:text-rose-500 transition-colors leading-none">
                clear
              </button>
            )}
          </div>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input-style"
          />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.11}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="time" className="label-style">Time</Label>
            {time && (
              <button type="button" onClick={() => setTime('')} className="text-xs text-gray-400 hover:text-rose-500 transition-colors leading-none">
                clear
              </button>
            )}
          </div>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="input-style"
          />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.12}>
        <div className="space-y-1.5">
          <Label className="label-style">Status</Label>
          <Select value={status} onValueChange={v => setStatus(v as PlanStatus)}>
            <SelectTrigger className="input-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wishlist">💜 Wishlist</SelectItem>
              <SelectItem value="pending">💛 Pending</SelectItem>
              <SelectItem value="planned">💙 Planned</SelectItem>
              <SelectItem value="done">💚 Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.13}>
        <div className="space-y-1.5">
          <Label htmlFor="objective" className="label-style flex items-center gap-1.5">
            <ScrollText className="w-3.5 h-3.5 text-rose-400" />
            Royal decree (objective)
          </Label>
          <Textarea
            id="objective"
            placeholder="What is the noble aim of this date?"
            value={objective}
            onChange={e => setObjective(e.target.value)}
            className="input-style resize-none"
            rows={2}
          />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.135}>
        <div className="space-y-1.5">
          <Label className="label-style flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            Side quests
          </Label>
          <QuestList items={sideQuests} onChange={setSideQuests} placeholder="A small adventure…" />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.14}>
        <div className="space-y-1.5">
          <Label className="label-style flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-rose-400" />
            Trinkets &amp; bounty
          </Label>
          <QuestList items={trinkets} onChange={setTrinkets} placeholder="A keepsake to bring home…" />
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.15}>
        <div className="flex gap-2 pt-1">
          <Button type="submit" className="btn-primary flex-1 gap-1.5" disabled={loading}>
            <Check className="w-4 h-4" />
            {loading ? 'Saving…' : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="gap-1.5">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </AnimatedContent>
    </form>
  )
}
