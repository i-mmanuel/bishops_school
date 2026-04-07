'use client'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
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
    <div className="min-h-[100dvh] bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPath={pathname} />
      </div>

      {/* Top header */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-background/60 backdrop-blur-xl z-50 flex justify-between items-center px-6 md:px-8 border-b border-outline-variant/10">
        {/* Left slot */}
        <div className="flex items-center gap-3 md:flex-1 md:max-w-md">
          {/* Mobile: avatar + title */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 shrink-0">
              <Image
                src="https://i.pravatar.cc/80?u=principal-julian"
                alt="Principal"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold font-headline text-primary">Attendance</span>
          </div>
          {/* Desktop: search input */}
          <div className="relative flex-1 hidden md:block">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              placeholder="Search students or modules..."
              className="w-full bg-surface-container-low rounded-full pl-9 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all font-label"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="md:ml-64 pt-16 pb-20 md:pb-12 min-h-[100dvh]">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
