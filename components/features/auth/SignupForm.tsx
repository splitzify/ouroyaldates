'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AnimatedContent from '@/components/bits/AnimatedContent'

export default function SignupForm() {
  const { signUp } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <AnimatedContent distance={30} direction="vertical" duration={0.6} delay={0.1}>
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
          <p className="text-white/60 text-sm">Start planning beautiful dates together</p>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={30} direction="vertical" duration={0.6} delay={0.2}>
        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-5 sm:p-7 rounded-2xl">
          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/30 rounded-xl p-3 text-center">
              {error}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white/80 text-xs font-medium uppercase tracking-wider">Your name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Alex"
              value={name}
              onChange={e => setName(e.target.value)}
              className="glass-input"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/80 text-xs font-medium uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="glass-input"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-white/80 text-xs font-medium uppercase tracking-wider">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="glass-input"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full btn-primary h-11 text-sm font-semibold" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </AnimatedContent>

      <AnimatedContent distance={20} direction="vertical" duration={0.6} delay={0.3}>
        <p className="text-center text-white/50 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-rose-300 hover:text-rose-200 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </AnimatedContent>
    </div>
  )
}
