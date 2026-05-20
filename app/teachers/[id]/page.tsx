import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { teacherAvatar } from '@/lib/teacher-avatars'
import { CaretLeft, CheckCircle, Circle } from '@phosphor-icons/react/dist/ssr'

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

export default async function TeacherCoveragePage({
  params,
}: {
  params: { id: string }
}) {
  const teacherId = Number(params.id)
  if (!Number.isFinite(teacherId)) notFound()

  let coverage
  try {
    coverage = await api.getTeacherCoverage(teacherId)
  } catch {
    notFound()
  }

  const overall = rateColor(coverage.rate)

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant/70 hover:text-on-surface mb-6 font-label transition-colors"
        >
          <CaretLeft size={16} weight="bold" />
          Back to dashboard
        </Link>

        {/* Header */}
        <div
          className="rounded-2xl border border-white/[0.07] p-6 mb-8"
          style={glassCard}
        >
          <div className="flex items-center gap-5 mb-5">
            <div
              className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20"
              style={{ boxShadow: '0 0 16px rgba(124,58,237,0.2)' }}
            >
              <Image
                src={teacherAvatar(coverage.teacher)}
                alt={coverage.teacher.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface truncate">
                {coverage.teacher.name}
              </h1>
              <p className="text-sm text-on-surface-variant/60 font-label mt-1">
                Lesson coverage across assigned modules
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-3xl md:text-4xl font-black font-headline ${overall.text}`}>
                {coverage.rate}%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mt-1">
                {coverage.taught_chapters} of {coverage.total_chapters} chapters
              </div>
            </div>
          </div>
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r ${overall.gradient}`}
              style={{ width: `${coverage.rate}%` }}
            />
          </div>
        </div>

        {/* Empty state */}
        {coverage.modules.length === 0 && (
          <div
            className="rounded-2xl border border-white/[0.07] p-8 text-center"
            style={glassCard}
          >
            <p className="text-on-surface-variant/70 font-label text-sm">
              No modules assigned to this teacher yet.
            </p>
          </div>
        )}

        {/* Module sections */}
        <div className="space-y-6">
          {coverage.modules.map(module => {
            const m = rateColor(module.rate)
            return (
              <section
                key={module.id}
                className="rounded-2xl border border-white/[0.07] overflow-hidden"
                style={glassCard}
              >
                <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-3">
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

                <div className="px-6 py-5 space-y-6">
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
              </section>
            )
          })}
        </div>
      </div>
    </PrincipalShell>
  )
}
