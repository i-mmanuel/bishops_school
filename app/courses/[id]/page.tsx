import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getModuleById, getStudentsForModule,
  getSessionsByModule, getAttendanceForSession, getTeachersForModule,
  getAttendanceRate, getStudentAvatarUrl, getModuleBookStats
} from '@/lib/mock-data'
import {
  CaretRight,
  ArrowSquareOut,
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  DotsThree,
  NotePencil,
  User
} from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const moduleData = getModuleById(params.id)
  if (!moduleData) notFound()

  const students = getStudentsForModule(params.id)
  const sessions = getSessionsByModule(params.id).sort((a, b) => b.date.localeCompare(a.date))
  const latestSession = sessions[0]
  const latestAttendance = latestSession ? getAttendanceForSession(latestSession.id) : []
  const presentCount = latestAttendance.filter(a => a.status === 'present').length
  const absentCount = latestAttendance.filter(a => a.status === 'absent').length

  const teacherAssignments = getTeachersForModule(params.id)
  const primaryTeacher = teacherAssignments[0]?.teacher
  const bookStats = getModuleBookStats(params.id)
  const taughtCount = bookStats.filter(b => b.taught).length

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* DESKTOP ONLY */}
        <div className="hidden md:block">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-6">
            <Link href="/courses" className="hover:text-primary-dim transition-colors">Modules</Link>
            <CaretRight size={10} />
            <span className="text-on-surface-variant/60">{moduleData.code}</span>
            <CaretRight size={10} />
            <span className="text-on-surface">{moduleData.name}</span>
          </nav>

          {/* Title + action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-primary-dim">{moduleData.name}</h1>
              <p className="text-on-surface-variant/60 font-label max-w-xl leading-relaxed">
                {moduleData.books.length} books · Code: {moduleData.code}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="px-6 py-3 rounded-full border border-white/[0.08] hover:bg-white/5 transition-all text-on-surface font-semibold font-label flex items-center gap-2 text-sm"
                style={glassCard}
              >
                <ArrowSquareOut size={18} />
                Export List
              </button>
              <Link
                href="/attend"
                className="px-8 py-3 rounded-full font-bold font-label flex items-center gap-2 text-sm text-white hover:opacity-90 hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
              >
                <UserCheck size={18} weight="fill" />
                Mark Attendance
              </Link>
            </div>
          </div>

          {/* Stats grid (3 cards) */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-xl border border-white/[0.07] flex flex-col gap-4" style={glassCard}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                  style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}>
                  <Users size={20} className="text-primary-dim" />
                </div>
                <span className="text-[10px] text-on-surface-variant/60 font-label uppercase tracking-widest">Total Students</span>
              </div>
              <div>
                <span className="text-4xl font-headline font-bold text-on-surface">{students.length}</span>
                <span className="text-on-surface-variant/60 ml-2 font-label text-sm">Enrolled</span>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-white/[0.07] flex flex-col gap-4" style={glassCard}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"
                  style={{ boxShadow: '0 0 12px rgba(6,182,212,0.2)' }}>
                  <CheckCircle size={20} className="text-secondary-dim" weight="fill" />
                </div>
                <span className="text-[10px] text-on-surface-variant/60 font-label uppercase tracking-widest">Last Session</span>
              </div>
              <div>
                <span className="text-4xl font-headline font-bold text-secondary-dim">{presentCount}</span>
                <span className="text-on-surface-variant/60 ml-2 font-label text-sm">Present</span>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-white/[0.07] flex flex-col gap-4" style={glassCard}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center"
                  style={{ boxShadow: '0 0 12px rgba(244,63,94,0.15)' }}>
                  <XCircle size={20} className="text-tertiary-dim" weight="fill" />
                </div>
                <span className="text-[10px] text-on-surface-variant/60 font-label uppercase tracking-widest">Missing</span>
              </div>
              <div>
                <span className="text-4xl font-headline font-bold text-tertiary-dim">{absentCount}</span>
                <span className="text-on-surface-variant/60 ml-2 font-label text-sm">Absent</span>
              </div>
            </div>
          </div>

          {/* Student table */}
          <section className="rounded-2xl overflow-hidden border border-white/[0.07] mb-10" style={glassCard}>
            <table className="w-full text-left font-label">
              <thead>
                <tr className="text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] border-b border-white/[0.06]">
                  <th className="px-8 py-6">Student Name</th>
                  <th className="px-8 py-6">Last Session</th>
                  <th className="px-8 py-6">Overall Rate</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {students.map(student => {
                  const latestStatus = latestAttendance.find(a => a.studentId === student.id)?.status ?? 'absent'
                  const { rate } = getAttendanceRate(student.id)
                  const isPresent = latestStatus === 'present'
                  const statusBg = isPresent ? 'rgba(6,182,212,0.1)' : 'rgba(244,63,94,0.1)'
                  const statusBorder = isPresent ? 'rgba(6,182,212,0.25)' : 'rgba(244,63,94,0.25)'
                  const statusTextColor = isPresent ? 'text-secondary-dim' : 'text-tertiary-dim'
                  const dotGlow = isPresent ? '0 0 8px #22d3ee' : '0 0 8px #fb7185'
                  const dotBg = isPresent ? 'bg-secondary-dim' : 'bg-tertiary-dim'
                  return (
                    <tr key={student.id} className="group hover:bg-white/[0.03] transition-all duration-200">
                      <td className="px-8 py-5">
                        <Link href={`/students/${student.id}`} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                            <Image src={getStudentAvatarUrl(student.id)} alt={student.name} width={40} height={40} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-semibold text-on-surface">{student.name}</div>
                            <div className="text-xs text-on-surface-variant/60">{student.id.toUpperCase()}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusTextColor}`}
                          style={{ background: statusBg, borderColor: statusBorder }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} style={{ boxShadow: dotGlow }} />
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant/60">{rate}%</td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-on-surface-variant/40 hover:text-on-surface transition-colors p-1">
                          <DotsThree size={20} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {/* Topic completion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <NotePencil size={20} className="text-primary-dim" />
                Book Progress
              </h3>
              <span
                className="text-xs font-label text-on-surface-variant/60 px-3 py-1 rounded-full border border-white/[0.07]"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {taughtCount}/{bookStats.length} taught
              </span>
            </div>
            <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.04]" style={glassCard}>
              {bookStats.map((b, i) => {
                const barGradient = !b.taught ? undefined : b.attendanceRate >= 80 ? 'from-secondary to-secondary-dim' : b.attendanceRate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
                const rateColor = !b.taught ? 'text-on-surface-variant/60' : b.attendanceRate >= 80 ? 'text-secondary-dim' : b.attendanceRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
                return (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <span
                      className="w-6 h-6 rounded-full text-[10px] font-bold font-label text-on-surface-variant/60 flex items-center justify-center shrink-0 border border-white/[0.08]"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-label font-medium text-on-surface truncate">{b.book.name}</p>
                      <div className="mt-1.5 h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        {barGradient && (
                          <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${b.attendanceRate}%` }} />
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 w-20">
                      {b.taught ? (
                        <>
                          <span className={`text-sm font-black font-headline ${rateColor}`}>{b.attendanceRate}%</span>
                          <p className="text-[10px] text-on-surface-variant/60 font-label">{b.sessions} session{b.sessions > 1 ? 's' : ''}</p>
                        </>
                      ) : (
                        <span className="text-[10px] font-label text-on-surface-variant/50 uppercase tracking-wider">Not started</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* MOBILE ONLY */}
        <div className="md:hidden">

          {/* Mobile: hero */}
          <section className="space-y-1 mb-6">
            <p className="text-primary-dim font-label text-sm font-semibold tracking-wider uppercase">Module</p>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface">{moduleData.name}</h2>
            {primaryTeacher && (
              <div className="flex items-center gap-2 text-on-surface-variant/60">
                <User size={16} />
                <span className="text-sm font-label font-medium">Teacher: {primaryTeacher.name}</span>
              </div>
            )}
          </section>

          {/* Mobile: Stats bento */}
          <section className="grid grid-cols-6 gap-3 mb-6">
            <div className="col-span-6 rounded-xl p-5 border border-white/[0.07] relative overflow-hidden" style={glassCard}>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Users size={64} />
              </div>
              <p className="text-on-surface-variant/60 text-sm font-label font-medium">Total Enrolled</p>
              <p className="text-4xl font-headline font-bold mt-1 text-on-surface">{students.length}</p>
              <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full bg-gradient-to-r from-primary to-primary-dim w-full" style={{ boxShadow: '0 0 8px rgba(124,58,237,0.4)' }} />
              </div>
            </div>
            <div className="col-span-3 rounded-xl p-5 border border-secondary/20" style={{ background: 'rgba(6,182,212,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-secondary-dim" style={{ boxShadow: '0 0 6px #22d3ee' }} />
                <p className="text-on-surface-variant/60 text-xs font-label font-medium uppercase tracking-tighter">Present</p>
              </div>
              <p className="text-3xl font-headline font-bold text-secondary-dim">{String(presentCount).padStart(2, '0')}</p>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 font-label">
                {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}% Attendance
              </p>
            </div>
            <div className="col-span-3 rounded-xl p-5 border border-tertiary/20" style={{ background: 'rgba(244,63,94,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-tertiary-dim" style={{ boxShadow: '0 0 6px #fb7185' }} />
                <p className="text-on-surface-variant/60 text-xs font-label font-medium uppercase tracking-tighter">Absent</p>
              </div>
              <p className="text-3xl font-headline font-bold text-tertiary-dim">{String(absentCount).padStart(2, '0')}</p>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 font-label">Check logs</p>
            </div>
          </section>

          {/* Mobile: Topic progress */}
          <section className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold">Book Progress</h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-label font-medium text-primary-dim border border-white/[0.07]"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {taughtCount}/{bookStats.length} taught
              </span>
            </div>
            <div className="rounded-xl overflow-hidden divide-y divide-white/[0.04] border border-white/[0.07]" style={glassCard}>
              {bookStats.map((b, i) => {
                const barGradient = !b.taught ? undefined : b.attendanceRate >= 80 ? 'from-secondary to-secondary-dim' : b.attendanceRate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
                const rateColor = !b.taught ? 'text-on-surface-variant/60' : b.attendanceRate >= 80 ? 'text-secondary-dim' : b.attendanceRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
                return (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full text-[10px] font-bold font-label text-on-surface-variant/60 flex items-center justify-center shrink-0 border border-white/[0.08]"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-label font-medium text-on-surface truncate">{b.book.name}</p>
                      <div className="mt-1 h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        {barGradient && <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${b.attendanceRate}%` }} />}
                      </div>
                    </div>
                    <div className="shrink-0 text-right w-16">
                      {b.taught
                        ? <span className={`text-sm font-black font-headline ${rateColor}`}>{b.attendanceRate}%</span>
                        : <span className="text-[9px] font-label text-on-surface-variant/50 uppercase tracking-wider">Pending</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Mobile: Students list */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold">Students List</h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-label font-medium text-primary-dim border border-white/[0.07]"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {presentCount}/{students.length} Present
              </span>
            </div>
            <div className="space-y-3">
              {students.map(student => {
                const latestStatus = latestAttendance.find(a => a.studentId === student.id)?.status ?? 'absent'
                const isPresent = latestStatus === 'present'
                return (
                  <Link
                    key={`mob-${student.id}`}
                    href={`/students/${student.id}`}
                    className="rounded-xl p-4 flex items-center justify-between border border-white/[0.07] hover:border-white/[0.12] transition-colors duration-200"
                    style={glassCard}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${isPresent ? 'border-secondary/25' : 'border-tertiary/25'} shrink-0`}>
                        <Image src={getStudentAvatarUrl(student.id)} alt={student.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">{student.name}</p>
                        <p className="text-xs text-on-surface-variant/60 font-label">ID: #{student.id.toUpperCase()}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border font-label ${isPresent ? 'bg-secondary/10 text-secondary-dim border-secondary/25' : 'bg-tertiary/10 text-tertiary-dim border-tertiary/25'}`}
                    >
                      {isPresent ? 'Present' : 'Absent'}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

        </div>

      </div>
    </PrincipalShell>
  )
}
