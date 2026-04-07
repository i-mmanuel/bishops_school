'use client'
import Link from 'next/link'
import { House, BookOpen, Users, ChartBar } from '@phosphor-icons/react'

const tabs = [
  { href: '/dashboard', label: 'Dashboard', Icon: House },
  { href: '/courses',   label: 'Courses',   Icon: BookOpen },
  { href: '/students',  label: 'Students',  Icon: Users },
  { href: '/reports',   label: 'Reports',   Icon: ChartBar },
]

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="bg-surface-container-high border-t border-outline-variant/20 px-2 py-2">
      <div className="flex justify-around">
        {tabs.map(({ href, label, Icon }) => {
          const active = currentPath.startsWith(href)
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-4 py-1">
              <Icon size={22} weight={active ? 'fill' : 'regular'}
                className={active ? 'text-primary' : 'text-on-surface-variant'} />
              <span className={`text-[10px] font-label ${active ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
