import { notFound } from 'next/navigation'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getStudentById, getCoursesForStudent, getAttendanceRate,
  getRecentAttendanceHistory, getClassById, getChurchById, getDenominationById
} from '@/lib/mock-data'
import {
  Seal,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  GraduationCap,
  ChartBar,
  ClockCounterClockwise,
} from '@phosphor-icons/react/dist/ssr'

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudentById(params.id)
  if (!student) notFound()

  const modules = getCoursesForStudent(params.id)
  const history = getRecentAttendanceHistory(params.id)

  const { present: totalPresent, total: totalSessions } = getAttendanceRate(params.id)
  const totalAbsent = totalSessions - totalPresent
  const overallRate = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0

  const studentClass = getClassById(student.classId)
  const church = getChurchById(student.churchId)
  const denomination = church ? getDenominationById(church.denominationId) : undefined

  const isAwardEligible = overallRate >= 90

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* ── Desktop hero ── */}
        <section className="hidden md:grid grid-cols-12 gap-8 items-end mb-8">
          {/* Left: avatar + name */}
          <div className="col-span-8 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group">
              <div className="w-48 h-48 rounded-xl overflow-hidden shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] border-2 border-outline-variant/10">
                <Image
                  src={`https://i.pravatar.cc/200?u=${student.id}`}
                  alt={student.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-on-secondary shadow-lg">
                <Seal size={24} weight="fill" className="text-on-secondary" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-2">
              <span className="text-primary font-semibold tracking-wider text-xs uppercase font-label">Student Profile</span>
              <h1 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter">{student.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-on-surface-variant text-sm font-label">
                <span className="bg-surface-container-high px-3 py-1 rounded-full">ID: {student.id.toUpperCase()}</span>
                <span className="bg-surface-container-high px-3 py-1 rounded-full">{studentClass?.name} Class</span>
                {church && <span className="bg-surface-container-high px-3 py-1 rounded-full">{church.name}</span>}
              </div>
            </div>
          </div>
          {/* Right: Total Attendance % */}
          <div className="col-span-4 flex flex-col items-end">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 w-full text-center md:text-right">
              <span className="text-on-surface-variant text-sm font-label font-medium block mb-1">Total Attendance</span>
              <div className="text-6xl font-black font-headline text-secondary tracking-tighter">{overallRate}%</div>
              <span className="text-secondary-dim text-xs font-semibold font-label">
                {totalPresent}/{totalSessions} sessions attended
              </span>
            </div>
          </div>
        </section>

        {/* ── Desktop 4-stat bento grid ── */}
        <section className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-4">
              <CheckCircle size={30} className="text-secondary" weight="fill" />
              <span className="text-secondary font-bold text-lg font-headline">{totalPresent}</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-label font-medium">Present Days</h3>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-4">
              <XCircle size={30} className="text-error" weight="fill" />
              <span className="text-error font-bold text-lg font-headline">{totalAbsent}</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-label font-medium">Absent Total</h3>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-4">
              <Clock size={30} className="text-tertiary" />
              <span className="text-tertiary font-bold text-lg font-headline">0</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-label font-medium">Late Arrivals</h3>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-4">
              <Info size={30} className="text-primary" />
              <span className="text-primary font-bold text-lg font-headline">0</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-label font-medium">Excused Leaves</h3>
          </div>
        </section>

        {/* ── Desktop History + Module Breakdown two-column ── */}
        <div className="hidden md:grid grid-cols-12 gap-8 mb-8">
          {/* Recent History - 5 cols */}
          <section className="col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Recent History</h2>
              <button className="text-primary text-sm font-semibold font-label hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {history.slice(0, 5).map((h, i) => {
                const dotColor = h.status === 'present' ? 'bg-secondary ring-secondary/10' : 'bg-error ring-error/10'
                const dateStr = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                const label = h.status === 'present' ? 'Attended' : 'Absent'
                return (
                  <div key={i} className="flex gap-4 items-start p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                    <div className={`mt-1 w-2 h-2 rounded-full ring-4 shrink-0 ${dotColor}`} />
                    <div>
                      <p className="text-sm font-semibold font-label">{dateStr}: {label}</p>
                      <p className="text-xs text-on-surface-variant font-label mt-1">{h.moduleName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Module Breakdown - 7 cols */}
          <section className="col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Module Breakdown</h2>
              <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded font-label">{studentClass?.name} Class</span>
            </div>
            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/5">
              <div className="divide-y divide-outline-variant/10">
                {modules.map((mod, idx) => {
                  const { rate, present: modPresent, total: modTotal } = getAttendanceRate(params.id)
                  const iconColors = ['text-primary bg-primary/10', 'text-secondary bg-secondary/10', 'text-tertiary bg-tertiary/10', 'text-on-surface-variant bg-on-surface-variant/10']
                  const iconColor = iconColors[idx % iconColors.length]
                  const barColor = rate >= 80 ? 'bg-secondary' : rate >= 65 ? 'bg-primary' : 'bg-error'
                  const rateColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-on-surface' : 'text-error'
                  return (
                    <div key={mod.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-surface-container-high transition-all">
                      <div className="flex gap-4 items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface font-label">{mod.name}</h4>
                          <p className="text-xs text-on-surface-variant font-label">{mod.topics.length} topics · {mod.code}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 w-full sm:w-48">
                        <div className="flex justify-between w-full text-xs font-bold font-label">
                          <span className={rateColor}>{rate}%</span>
                          <span className="text-on-surface-variant">{modPresent}/{modTotal} sessions</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rate}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>

        {/* ── Desktop award banner ── */}
        {isAwardEligible && (
          <section className="hidden md:block bg-surface-container-highest p-8 rounded-2xl border border-outline-variant/10 relative overflow-hidden mb-8">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-headline">Excellence Award Eligible</h2>
                <p className="text-on-surface-variant max-w-md font-label text-sm">
                  {student.name} is maintaining {overallRate}% attendance. Keep it up to receive the Scholar Excellence recognition.
                </p>
              </div>
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-xl shadow-lg hover:brightness-110 transition-all font-label whitespace-nowrap">
                Download Attendance Report
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full -ml-10 -mb-10 blur-3xl" />
          </section>
        )}

        {/* ── Mobile hero ── */}
        <section className="md:hidden flex flex-col items-center text-center space-y-4 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-secondary">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface">
                <Image
                  src={`https://i.pravatar.cc/200?u=${student.id}`}
                  alt={student.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-secondary text-on-secondary px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
              <Seal size={12} weight="fill" />
              <span className="text-[10px] font-bold tracking-wider">Verified</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">{student.name}</h2>
            <p className="text-on-surface-variant font-label text-sm">{studentClass?.name} Class · {denomination?.abbreviation ?? ''}</p>
          </div>
        </section>

        {/* ── Mobile 4-stat grid ── */}
        <section className="md:hidden grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Present', value: totalPresent, color: 'text-secondary', barColor: 'bg-secondary', barWidth: `${overallRate}%`, trackColor: 'bg-secondary-container/30' },
            { label: 'Late', value: 0, color: 'text-tertiary', barColor: 'bg-tertiary', barWidth: '0%', trackColor: 'bg-tertiary-container/30' },
            { label: 'Absent', value: totalAbsent, color: 'text-error', barColor: 'bg-error', barWidth: `${totalSessions > 0 ? Math.round((totalAbsent / totalSessions) * 100) : 0}%`, trackColor: 'bg-error-container/30' },
            { label: 'Excused', value: 0, color: 'text-primary', barColor: 'bg-primary', barWidth: '0%', trackColor: 'bg-primary-container/30' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10 flex flex-col space-y-2">
              <span className={`${stat.color} text-[12px] font-bold tracking-widest uppercase font-label`}>{stat.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-headline font-bold">{stat.value}</span>
              </div>
              <div className={`h-1 w-full ${stat.trackColor} rounded-full overflow-hidden`}>
                <div className={`h-full ${stat.barColor} rounded-full`} style={{ width: stat.barWidth }} />
              </div>
            </div>
          ))}
        </section>

        {/* ── Mobile module breakdown ── */}
        <section className="md:hidden space-y-4 mb-8">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <ChartBar size={20} className="text-primary" />
            Module Breakdown
          </h3>
          <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
            {modules.map(mod => {
              const { rate } = getAttendanceRate(params.id)
              const rateColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-primary' : 'text-error'
              const barColor = rate >= 80 ? 'bg-secondary' : rate >= 65 ? 'bg-primary' : 'bg-error'
              return (
                <div key={mod.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-label font-medium">
                    <span className="text-on-surface truncate max-w-[60%]">{mod.name}</span>
                    <span className={rateColor}>{rate}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Mobile timeline history ── */}
        <section className="md:hidden space-y-4 mb-8">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <ClockCounterClockwise size={20} className="text-primary" />
            Recent History
          </h3>
          <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
            {history.slice(0, 5).map((h, i) => {
              const isPresent = h.status === 'present'
              const dotBg = isPresent ? 'bg-secondary/20' : 'bg-error/20'
              const dotInner = isPresent ? 'bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.6)]' : 'bg-error shadow-[0_0_8px_rgba(255,110,132,0.6)]'
              const statusLabel = isPresent ? 'Marked Present' : 'Marked Absent'
              const statusColor = isPresent ? 'text-secondary-dim' : 'text-error'
              const dateStr = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <div key={i} className="relative">
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full ${dotBg} flex items-center justify-center`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotInner}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter font-label">{dateStr}</span>
                    <span className="text-on-surface font-semibold font-label">{h.moduleName}</span>
                    <span className={`text-sm mt-1 font-label ${statusColor}`}>{statusLabel}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Mobile award banner ── */}
        {isAwardEligible && (
          <section className="md:hidden bg-surface-container-highest p-6 rounded-2xl border border-outline-variant/10 relative overflow-hidden mb-4">
            <div className="relative z-10 space-y-3">
              <h2 className="text-xl font-bold font-headline">Excellence Award Eligible</h2>
              <p className="text-on-surface-variant font-label text-sm">
                {student.name} is maintaining {overallRate}% attendance — on track for the Scholar Excellence recognition.
              </p>
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-3 rounded-xl shadow-lg font-label text-sm w-full">
                Download Attendance Report
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-3xl" />
          </section>
        )}

      </div>
    </PrincipalShell>
  )
}
