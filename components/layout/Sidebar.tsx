'use client'
import Link from 'next/link'
import { House, BookOpen, Users, ChartBar, SignOut } from '@phosphor-icons/react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: House },
  { href: '/courses',   label: 'Courses',   Icon: BookOpen },
  { href: '/students',  label: 'Students',  Icon: Users },
  { href: '/reports',   label: 'Reports',   Icon: ChartBar },
]

export default function Sidebar({ currentPath }: { currentPath: string }) {
  const { logout } = useAuth()
  const router = useRouter()

  return (
    <aside className="w-56 min-h-[100dvh] bg-surface-container-low flex flex-col py-6 px-3 border-r border-outline-variant/10">
      <div className="px-3 mb-8">
        <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Institution</p>
        <p className="text-sm font-headline font-bold text-on-surface mt-0.5">Elite Academy</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = currentPath.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200
                ${active ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
              <Icon size={18} weight={active ? 'fill' : 'regular'} />
              <span className="text-sm font-label font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
      <button onClick={() => { logout(); router.push('/login') }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-tertiary hover:bg-surface-container transition-colors duration-200">
        <SignOut size={18} />
        <span className="text-sm font-label font-medium">Sign Out</span>
      </button>
    </aside>
  )
}
