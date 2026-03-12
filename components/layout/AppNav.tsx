'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Heart, Plus, LogOut } from 'lucide-react'

export default function AppNav() {
  const { signOut } = useAuth()
  const pathname = usePathname()
  const isHome = pathname === '/dashboard'

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-rose-600 tracking-tight">
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          <span>Our Dates</span>
        </Link>

        <div className="flex items-center gap-2">
          {isHome && (
            <Button asChild size="sm" className="btn-primary gap-1.5 h-8 px-3 text-xs font-semibold">
              <Link href="/plans/new">
                <Plus className="w-3.5 h-3.5" />
                New plan
              </Link>
            </Button>
          )}
          <button
            onClick={signOut}
            title="Sign out"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
