'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Heart, Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-rose-600">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <span>Our Dates</span>
          </Link>
          <div className="flex items-center gap-2">
            {pathname === '/dashboard' && (
              <Button asChild size="sm" className="bg-rose-500 hover:bg-rose-600 gap-1">
                <Link href="/plans/new">
                  <Plus className="w-4 h-4" />
                  New plan
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
              <LogOut className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
