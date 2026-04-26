import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function supabaseAs(authHeader: string | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
      auth:   { persistSession: false, autoRefreshToken: false },
    },
  )
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null) as
    | { subscription: { endpoint: string; keys: { p256dh: string; auth: string } }; display_name?: string }
    | null

  if (!body?.subscription?.endpoint) {
    return NextResponse.json({ error: 'invalid subscription' }, { status: 400 })
  }

  const supabase = supabaseAs(auth)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      endpoint:     body.subscription.endpoint,
      p256dh:       body.subscription.keys.p256dh,
      auth:         body.subscription.keys.auth,
      user_id:      user.id,
      display_name: body.display_name ?? null,
    }, { onConflict: 'endpoint' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const auth     = req.headers.get('authorization')
  const endpoint = new URL(req.url).searchParams.get('endpoint')
  if (!auth || !endpoint) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const supabase = supabaseAs(auth)
  const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
