import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getTeacherById, getClassById, getModuleById,
  getSessionsByTeacher, getSessionsByClass,
  getAttendanceForSession,
} from '@/lib/mock-data'
import { CaretLeft, BookOpen, CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default function TeacherClassBreakdownPage({ params }: { params: { id: string; classId: string } }) {
  const teacher = getTeacherById(params.id)
  const cls = getClassById(params.classId)
  if (!teacher || !cls) notFound()

  const teacherClassSessions = getSessionsByTeacher(params.id)
    .filter(s => s.classId === params.classId)
    .sort((a, b) => b.date.localeCompare(a.date))

  const totalClassSessions = getSessionsByClass(params.classId).length
  const teachingPct = totalClassSessions > 0
    ? Math.round((teacherClassSessions.length / totalClassSessions) * 100)
    : 0

  const taughtModuleIds = Array.from(new Set(teacherClassSessions.map(s => s.moduleId)))

  const moduleGroups = taughtModuleIds.map(moduleId => {
    const mod = getModuleById(moduleId)!
    const sessions = teacherClassSessions.filter(s => s.moduleId === moduleId)
    const enriched = sessions.map(session => {
      const att = getAttendanceForSession(session.id)
      const present = att.filter(a => a.status === 'present').length
      const total = att.length
      const rate = total > 0 ? Math.round((present / total) * 100) : 0
      const topic = session.topicIndex < mod.topics.length ? mod.topics[session.topicIndex] : `Topic ${session.topicIndex + 1}`
      return { session, present, total, rate, topic }
    })
    const avgRate = enriched.length > 0
      ? Math.round(enriched.reduce((s, e) => s + e.rate, 0) / enriched.length)
      : 0
    return { mod, enriched, avgRate }
  })

  const allAtt = teacherClassSessions.flatMap(s => getAttendanceForSession(s.id))
  const overallPresent = allAtt.filter(a => a.status === 'present').length
  const overallTotal = allAtt.length
  const overallRate = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0
  const rateColor = overallRate >= 80 ? 'text-secondary-dim' : overallRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/teachers" className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant/60 hover:text-primary-dim transition-colors mb-6">
          <CaretLeft size={14} />
          Teachers
        </Link>

        {/* Hero */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0"
            style={{ boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}
          >
            <Image
              src={`https://i.pravatar.cc/80?u=${teacher.id}`}
              alt={teacher.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-0.5">{cls.name} Class</p>
            <h1 className="text-2xl md:text-3xl font-extrabold font-headline tracking-tight text-on-surface">{teacher.name}</h1>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Sessions Taught</p>
            <p className="text-3xl font-black font-headline text-on-surface">{teacherClassSessions.length}</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">of {totalClassSessions} total</p>
          </div>
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Share</p>
            <p className="text-3xl font-black font-headline text-primary-dim">{teachingPct}%</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">of class sessions</p>
          </div>
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Avg Attendance</p>
            <p className={`text-3xl font-black font-headline ${rateColor}`}>{overallRate}%</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">student presence</p>
          </div>
        </div>

        {/* Module breakdowns */}
        <div className="space-y-6">
          {moduleGroups.map(({ mod, enriched, avgRate }) => {
            const modRateColor = avgRate >= 80 ? 'text-secondary-dim' : avgRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
            const barGradient = avgRate >= 80 ? 'from-secondary to-secondary-dim' : avgRate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
            return (
              <div
                key={mod.id}
                className="rounded-xl border border-white/[0.07] overflow-hidden"
                style={glassCard}
              >
                {/* Module header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                      style={{ boxShadow: '0 0 10px rgba(124,58,237,0.2)' }}>
                      <BookOpen size={16} className="text-primary-dim" />
                    </div>
                    <div>
                      <p className="font-bold text-sm font-headline text-on-surface">{mod.name}</p>
                      <p className="text-[10px] text-on-surface-variant/60 font-label">{mod.code} · {enriched.length} session{enriched.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {enriched.length > 0 && (
                    <div className="text-right">
                      <p className={`text-lg font-black font-headline ${modRateColor}`}>{avgRate}%</p>
                      <p className="text-[10px] text-on-surface-variant/60 font-label">avg attendance</p>
                    </div>
                  )}
                </div>

                {/* Session rows */}
                {enriched.length === 0 ? (
                  <p className="px-5 py-4 text-xs font-label text-on-surface-variant/60">No sessions recorded yet.</p>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {enriched.map(({ session, present, total, rate, topic }) => {
                      const sRateColor = rate >= 80 ? 'text-secondary-dim' : rate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
                      const sBarGradient = rate >= 80 ? 'from-secondary to-secondary-dim' : rate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
                      const date = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      return (
                        <div key={session.id} className="px-5 py-4 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-label font-medium text-on-surface truncate">{topic}</p>
                            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">{date}</p>
                            <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className={`h-full rounded-full bg-gradient-to-r ${sBarGradient}`} style={{ width: `${rate}%` }} />
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className={`text-base font-black font-headline ${sRateColor}`}>{rate}%</p>
                            <div className="flex items-center justify-end gap-2 mt-0.5">
                              <span className="flex items-center gap-0.5 text-[10px] text-secondary-dim font-label">
                                <CheckCircle size={10} weight="fill" /> {present}
                              </span>
                              <span className="flex items-center gap-0.5 text-[10px] text-tertiary-dim font-label">
                                <XCircle size={10} weight="fill" /> {total - present}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Module progress bar */}
                {enriched.length > 0 && (
                  <div className="px-5 py-3 border-t border-white/[0.04]">
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${avgRate}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </PrincipalShell>
  )
}
