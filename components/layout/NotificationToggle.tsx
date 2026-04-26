'use client'

import { Bell, BellOff, BellRing } from 'lucide-react'
import { usePushSubscription } from '@/hooks/usePushSubscription'

export default function NotificationToggle() {
  const { state, subscribe, unsubscribe } = usePushSubscription()

  if (state === 'unsupported') return null

  if (state === 'denied') {
    return (
      <button
        type="button"
        title="Notifications blocked — enable them in your browser settings"
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300"
        disabled
      >
        <BellOff className="w-4 h-4" />
      </button>
    )
  }

  const subscribed = state === 'subscribed'
  const Icon = subscribed ? BellRing : Bell

  return (
    <button
      type="button"
      onClick={subscribed ? unsubscribe : subscribe}
      title={subscribed ? 'Notifications on — click to turn off' : 'Turn on notifications'}
      aria-label={subscribed ? 'Turn off notifications' : 'Turn on notifications'}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
        subscribed
          ? 'text-rose-500 hover:bg-rose-50'
          : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}
