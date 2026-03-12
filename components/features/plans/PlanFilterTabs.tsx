'use client'

import type { PlanStatus } from '@/types'

type FilterValue = PlanStatus | 'all'

const FILTERS: { label: string; value: FilterValue; emoji: string }[] = [
  { label: 'All',      value: 'all',      emoji: '✨' },
  { label: 'Wishlist', value: 'wishlist',  emoji: '💜' },
  { label: 'Planned',  value: 'planned',   emoji: '💙' },
  { label: 'Done',     value: 'done',      emoji: '💚' },
]

interface Props {
  active: FilterValue
  onChange: (value: FilterValue) => void
  counts: Record<FilterValue, number>
}

export default function PlanFilterTabs({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`
            flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${active === f.value
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-rose-200 hover:text-rose-500'
            }
          `}
        >
          <span>{f.emoji}</span>
          <span>{f.label}</span>
          <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${active === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {counts[f.value]}
          </span>
        </button>
      ))}
    </div>
  )
}
