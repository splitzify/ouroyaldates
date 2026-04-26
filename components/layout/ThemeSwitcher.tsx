'use client'

import { Sun, Moon, Castle } from 'lucide-react'
import { useTheme, type Theme } from '@/hooks/useTheme'

const OPTIONS: { value: Theme; Icon: typeof Sun; label: string }[] = [
  { value: 'light',    Icon: Sun,    label: 'Light theme' },
  { value: 'dark',     Icon: Moon,   label: 'Dark theme' },
  { value: 'medieval', Icon: Castle, label: 'Medieval theme' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-switcher inline-flex items-center gap-0.5 rounded-full border p-0.5">
      {OPTIONS.map(({ value, Icon, label }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`theme-switcher-btn w-7 h-7 flex items-center justify-center rounded-full transition-colors ${active ? 'is-active' : ''}`}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        )
      })}
    </div>
  )
}
