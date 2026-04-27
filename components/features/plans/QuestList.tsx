'use client'

import type { QuestItem } from '@/types'
import { newQuestItem } from '@/types'
import { Plus, X, Check } from 'lucide-react'

interface Props {
  items:        QuestItem[]
  onChange:     (next: QuestItem[]) => void
  placeholder?: string
  /** Show checkbox to mark items done. Default true. */
  checkable?:   boolean
}

export default function QuestList({ items, onChange, placeholder, checkable = true }: Props) {
  function update(id: string, patch: Partial<QuestItem>) {
    onChange(items.map(i => (i.id === id ? { ...i, ...patch } : i)))
  }
  function remove(id: string) {
    onChange(items.filter(i => i.id !== id))
  }
  function add() {
    onChange([...items, newQuestItem()])
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          {checkable && (
            <button
              type="button"
              onClick={() => update(item.id, { done: !item.done })}
              aria-label={item.done ? 'Mark not done' : 'Mark done'}
              className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                item.done
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-gray-300 hover:border-rose-400 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <input
            type="text"
            value={item.text}
            placeholder={placeholder}
            onChange={e => update(item.id, { text: e.target.value })}
            className={`input-style flex-1 px-3 py-1.5 text-sm border ${item.done ? 'line-through text-gray-400' : ''}`}
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label="Remove"
            className="shrink-0 w-7 h-7 rounded-md text-gray-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add
      </button>
    </div>
  )
}
