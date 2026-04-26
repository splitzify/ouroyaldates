'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { urlBase64ToUint8Array, VAPID_PUBLIC_KEY } from '@/lib/push'
import { getDisplayName } from '@/types'

export type PushState = 'unsupported' | 'idle' | 'denied' | 'subscribed' | 'subscribing'

export function usePushSubscription() {
  const [state, setState] = useState<PushState>('idle')

  const refresh = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') { setState('denied'); return }

    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    setState(sub ? 'subscribed' : 'idle')
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const subscribe = useCallback(async () => {
    if (state === 'unsupported') return
    setState('subscribing')

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setState(permission === 'denied' ? 'denied' : 'idle'); return }

      const reg = await navigator.serviceWorker.ready
      let sub   = await reg.pushManager.getSubscription()
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly:      true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
      }

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not signed in')

      const rawName     = session.user.user_metadata?.display_name || session.user.email || ''
      const displayName = rawName ? getDisplayName(rawName) : null

      const res = await fetch('/api/push/subscribe', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ subscription: sub.toJSON(), display_name: displayName }),
      })
      if (!res.ok) throw new Error(await res.text())

      setState('subscribed')
    } catch (err) {
      console.error('[push] subscribe failed', err)
      setState('idle')
    }
  }, [state])

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (!sub) { setState('idle'); return }

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(sub.endpoint)}`, {
          method:  'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => {})
      }
      await sub.unsubscribe()
      setState('idle')
    } catch (err) {
      console.error('[push] unsubscribe failed', err)
    }
  }, [])

  return { state, subscribe, unsubscribe, refresh }
}
