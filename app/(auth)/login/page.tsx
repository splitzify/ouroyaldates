'use client'

import dynamic from 'next/dynamic'
import LoginForm from '@/components/features/auth/LoginForm'

const LiquidChrome = dynamic(() => import('@/components/bits/LiquidChrome'), { ssr: false })

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  )
}
