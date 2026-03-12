'use client'

import dynamic from 'next/dynamic'
import SignupForm from '@/components/features/auth/SignupForm'

const LiquidChrome = dynamic(() => import('@/components/bits/LiquidChrome'), { ssr: false })

export default function SignupPage() {
  return (
    <div className="auth-page">
      <LiquidChrome
        baseColor={[0.18, 0.04, 0.07]}
        speed={0.15}
        amplitude={0.28}
        frequencyX={2.8}
        frequencyY={2.8}
        interactive
      />
      <div className="auth-content">
        <SignupForm />
      </div>
    </div>
  )
}
