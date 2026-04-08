'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Module } from '@/lib/types'
import { MagnifyingGlass, BookOpen, Funnel } from '@phosphor-icons/react'
import CourseCard from '@/components/ui/CourseCard'

interface Props {
  courses: Module[]
  rates: Record<string, number>
}

export default function CourseDirectoryClient({ courses, rates }: Props) {
  const [query, setQuery] = useState('')

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      {/* Desktop filter bar */}
      <div className="hidden md:flex flex-wrap items-center gap-4 p-2 bg-surface-container-low rounded-2xl border border-outline-variant/10 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules…"
            className="w-full bg-surface-container-highest border border-outline-variant/40 rounded-xl pl-9 pr-4 py-2.5 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all duration-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
          <Funnel size={14} />
          Filter
        </button>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mb-6 space-y-4">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules…"
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Mobile curation header */}
      <div className="md:hidden flex justify-between items-end mb-6">
        <div>
          <p className="text-secondary text-xs font-bold tracking-widest uppercase font-label mb-1">Curation</p>
          <h2 className="font-headline text-2xl font-bold tracking-tight">Active Directories</h2>
        </div>
        <span className="text-on-surface-variant text-xs font-medium bg-surface-container-high px-3 py-1 rounded-full font-label">
          {filtered.length} Results
        </span>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => (
          <CourseCard key={c.id} course={c} avgRate={rates[c.id] ?? 0} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm font-label text-on-surface-variant col-span-3">No modules match your search.</p>
        )}
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-4">
        {filtered.map(c => {
          const rate = rates[c.id] ?? 0
          const badgeBg = rate >= 80 ? 'bg-secondary/10' : rate >= 65 ? 'bg-primary/10' : 'bg-error/10'
          const badgeBorder = rate >= 80 ? 'border-secondary/20' : rate >= 65 ? 'border-primary/20' : 'border-error/20'
          const badgeColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-primary' : 'text-error'
          const badgeSubColor = rate >= 80 ? 'text-secondary/70' : rate >= 65 ? 'text-primary/70' : 'text-error/70'

          return (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="block rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden active:scale-[0.98] transition-transform duration-200"
              style={{
                background: 'rgba(25, 37, 64, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '0.5px solid rgba(109, 117, 140, 0.1)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-headline text-lg font-bold text-on-surface leading-tight mb-1">{c.name}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm font-label">
                    <BookOpen size={14} />
                    <span>{c.topics.length} topics · {c.code}</span>
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-xl text-center border ${badgeBg} ${badgeBorder}`}>
                  <span className={`font-bold text-lg leading-none ${badgeColor}`}>{rate}%</span>
                  <p className={`text-[10px] uppercase tracking-tighter mt-1 ${badgeSubColor}`}>Completion</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm font-label text-on-surface-variant">No modules match your search.</p>
        )}
      </div>
    </>
  )
}
