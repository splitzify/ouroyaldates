'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { plansService } from '@/services/plans.service'
import { createClient } from '@/lib/supabase'
import type { PlanStatus } from '@/types'
import PlanForm from '@/components/features/plans/PlanForm'
import AnimatedContent from '@/components/bits/AnimatedContent'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function NewPlanPage() {
  const router = useRouter()

  async function handleSave(data: { title: string; description: string; planned_date: string; status: PlanStatus }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const plan = await plansService.create(user.id, {
      title:        data.title,
      description:  data.description || undefined,
      planned_date: data.planned_date || undefined,
      status:       data.status,
    })
    router.push(`/plans/${plan.id}`)
  }

  return (
    <div className="space-y-5">
      <AnimatedContent distance={20} direction="vertical" duration={0.4}>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="-ml-2">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              New date plan
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">What are you dreaming up?</p>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.4} delay={0.05}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <PlanForm onSave={handleSave} submitLabel="Create plan" />
        </div>
      </AnimatedContent>
    </div>
  )
}
