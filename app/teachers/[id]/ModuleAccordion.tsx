'use client'

import { useState } from 'react'
import { CheckCircle, Circle } from '@phosphor-icons/react'
import type { TeacherCoverageModule } from '@/lib/api-types'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

function rateColor(rate: number) {
  if (rate >= 80) return { text: 'text-secondary-dim', gradient: 'from-secondary to-secondary-dim' }
  if (rate >= 65) return { text: 'text-primary-dim', gradient: 'from-primary to-primary-dim' }
  return { text: 'text-tertiary-dim', gradient: 'from-tertiary to-tertiary-dim' }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

interface Props {
  modules: TeacherCoverageModule[]
}

export default function ModuleAccordion({ modules }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {modules.map(module => {
        const m = rateColor(module.rate)
        const expanded = expandedId === module.id

        return (
          <section
            key={module.id}
            className="rounded-2xl border border-white/[0.07] overflow-hidden"
            style={glassCard}
          >
            <button
              onClick={() => setExpandedId(expanded ? null : module.id)}
              className="w-full text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-on-surface-variant/50 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                  >
                    ▸
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold font-headline text-on-surface truncate">
                      {module.name}
                    </h2>
                    <p className="text-xs text-on-surface-variant/60 font-label mt-0.5">
                      {module.code} · {module.taught_chapters} of {module.total_chapters} chapters
                    </p>
                  </div>
                  <span className={`text-2xl font-black font-headline ${m.text}`}>
                    {module.rate}%
                  </span>
                </div>
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden mb-4"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${m.gradient}`}
                    style={{ width: `${module.rate}%` }}
                  />
                </div>
                {module.classes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {module.classes.map(c => (
                      <span
                        key={c.id}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold font-label text-on-surface-variant/80 border border-white/[0.08]"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>

            {expanded && (
              <div className="border-t border-white/[0.06] px-6 py-5 space-y-6">
                {module.books.map(book => (
                  <div key={book.id}>
                    <h3 className="text-sm font-bold font-headline text-on-surface mb-3">
                      {book.name}
                    </h3>
                    <ul className="space-y-1.5">
                      {book.chapters.map(chapter => (
                        <li
                          key={chapter.index}
                          className="flex items-center gap-3 text-sm"
                        >
                          {chapter.taught ? (
                            <CheckCircle
                              size={18}
                              weight="fill"
                              className="text-secondary-dim shrink-0"
                            />
                          ) : (
                            <Circle
                              size={18}
                              weight="regular"
                              className="text-on-surface-variant/25 shrink-0"
                            />
                          )}
                          <span
                            className={`flex-1 truncate ${chapter.taught ? 'text-on-surface' : 'text-on-surface-variant/45'}`}
                          >
                            {chapter.title}
                          </span>
                          {chapter.last_taught_date && (
                            <span className="text-[11px] text-on-surface-variant/60 font-label shrink-0">
                              {formatDate(chapter.last_taught_date)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
