import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export const runtime = 'nodejs'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

interface SubRow {
  endpoint: string
  p256dh:   string
  auth:     string
  user_id:  string | null
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const payload = await req.json().catch(() => null) as
    | { title: string; body: string; url?: string; tag?: string; excludeUserId?: string }
    | null

  if (!payload?.title) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: auth } },
      auth:   { persistSession: false, autoRefreshToken: false },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let query = supabase.from('push_subscriptions').select('endpoint, p256dh, auth, user_id')
  if (payload.excludeUserId) query = query.neq('user_id', payload.excludeUserId)

  const { data: subs, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const body = JSON.stringify({
    title: payload.title,
    body:  payload.body,
    url:   payload.url ?? '/dashboard',
    tag:   payload.tag,
  })

  const stale: string[] = []
  const results = await Promise.allSettled(
    (subs as SubRow[]).map(s =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        body,
      ).catch(err => {
        if (err?.statusCode === 404 || err?.statusCode === 410) stale.push(s.endpoint)
        throw err
      }),
    ),
  )

  if (stale.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', stale)
  }

  return NextResponse.json({
    sent:    results.filter(r => r.status === 'fulfilled').length,
    failed:  results.filter(r => r.status === 'rejected').length,
    cleaned: stale.length,
  })
}
