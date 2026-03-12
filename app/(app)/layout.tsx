import AuthGuard from '@/components/layout/AuthGuard'
import AppNav from '@/components/layout/AppNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="app-shell">
        <AppNav />
        <main className="max-w-2xl mx-auto px-3 sm:px-4 py-5 sm:py-6">{children}</main>
      </div>
    </AuthGuard>
  )
}
