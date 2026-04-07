'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

export default function PrincipalShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar currentPath={pathname} />
      </div>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
