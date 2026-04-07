import PrincipalShell from '@/components/layout/PrincipalShell'
import Link from 'next/link'
import {
  getInstitutionHealth, getCriticalAlerts, getCourses, getCourseAverageAttendance,
  getPresentTodayCount, getAbsentTodayCount, getStudents, getAttendanceRate
} from '@/lib/mock-data'
import ProgressNebula from '@/components/ui/ProgressNebula'
import { TreeStructure, Cpu, Cloud, Palette, ChartLine } from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react/dist/lib/types'

// Map course IDs to subject icons
const COURSE_ICONS: Record<string, Icon> = {
  c1: TreeStructure,
  c2: Cpu,
  c3: Cloud,
  c4: Palette,
  c5: ChartLine,
}

// Color thresholds for presence badge
function presenceBadgeClass(rate: number) {
  if (rate >= 80) return { badge: 'bg-secondary-container/30 text-secondary ring-secondary/20', bar: 'bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.3)]', barWidth: `${rate}%` }
  if (rate >= 65) return { badge: 'bg-primary-container/30 text-primary ring-primary/20', bar: 'bg-primary shadow-[0_0_8px_rgba(163,166,255,0.3)]', barWidth: `${rate}%` }
  return { badge: 'bg-error-container/30 text-error ring-error/20', bar: 'bg-error shadow-[0_0_8px_rgba(215,51,87,0.3)]', barWidth: `${rate}%` }
}

export default function DashboardPage() {
  const health = getInstitutionHealth()
  const alerts = getCriticalAlerts()
  const courses = getCourses()
  const presentToday = getPresentTodayCount()
  const absentToday = getAbsentTodayCount()
  const totalStudents = getStudents().length

  // Enrich alerts with absent/total counts for "X/Y Missed" display
  const enrichedAlerts = alerts.map(a => {
    const { present, total } = getAttendanceRate(a.studentId, a.courseId)
    return { ...a, absent: total - present, total }
  })

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const kpis = [
    { label: 'Total Students',  value: totalStudents, secondary: null,          glow: 'bg-primary/5',   bar: 'bg-primary',   barWidth: '100%' },
    { label: 'Present Today',   value: presentToday,  secondary: `${health}%`,  glow: 'bg-secondary/5', bar: 'bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.4)]', barWidth: `${health}%` },
    { label: 'Absent',          value: absentToday,   secondary: null,          glow: 'bg-error/5',     bar: 'bg-error',     barWidth: `${Math.round((absentToday / Math.max(totalStudents, 1)) * 100)}%` },
    { label: 'Attendance Rate', value: `${health}%`,  secondary: null,          glow: 'bg-tertiary/5',  bar: 'bg-tertiary',  barWidth: `${health}%` },
  ]

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto space-y-10">

        {/* Hero header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Attendance Overview</h2>
            <p className="text-on-surface-variant font-label text-sm">Academic Quarter: Q3 · Today is {today}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-full bg-surface-container-highest text-on-surface border border-outline-variant/20 text-sm font-label font-medium hover:bg-surface-bright transition-all">
              Daily Report
            </button>
            <Link href="/attend"
              className="px-6 py-2.5 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-label font-bold text-sm shadow-xl shadow-primary/20 hover:scale-95 transition-transform">
              Take Attendance
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-surface-container-high rounded-xl p-5 md:p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.glow} rounded-full -mr-16 -mt-16 blur-3xl`} />
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4 font-label">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black font-headline">{kpi.value}</span>
                {kpi.secondary && <span className="text-on-surface-variant text-sm font-label">{kpi.secondary}</span>}
              </div>
              <div className="mt-5 w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${kpi.bar}`} style={{ width: kpi.barWidth }} />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary grid: courses + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Course rows (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Recent Course Attendance</h3>
              <Link href="/courses" className="text-primary text-sm font-label font-medium hover:underline">View Schedule</Link>
            </div>
            <div className="space-y-4">
              {courses.map(course => {
                const avgRate = getCourseAverageAttendance(course.id)
                const { badge, bar, barWidth } = presenceBadgeClass(avgRate)
                const CourseIcon = COURSE_ICONS[course.id] ?? TreeStructure
                const timeLabel = `${course.schedule.days.slice(0, 2).join('/')} · ${course.schedule.time} · ${course.schedule.room}`
                return (
                  <Link key={course.id} href={`/courses/${course.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 rounded-xl hover:translate-x-0.5 transition-transform duration-200 group"
                    style={{ background: 'rgba(25, 37, 64, 0.4)', backdropFilter: 'blur(12px)', border: '0.5px solid rgba(109, 117, 140, 0.1)' }}>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/10 shrink-0">
                        <CourseIcon size={26} className="text-primary-dim" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base md:text-lg leading-tight text-on-surface">{course.name}</h4>
                        <p className="text-on-surface-variant text-xs md:text-sm font-label mt-0.5">{timeLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-tight text-on-surface-variant font-bold font-label mb-1.5">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${badge}`}>{avgRate}% Presence</span>
                      </div>
                      <div className="w-24 md:w-32">
                        <p className="text-[10px] uppercase tracking-tight text-on-surface-variant font-bold font-label mb-1.5">Fill Rate</p>
                        <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${bar}`} style={{ width: barWidth }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right panel (1/3 width) */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Critical Alerts</h3>
              <span className="bg-error text-on-error text-[10px] font-black px-2 py-0.5 rounded font-label uppercase">{alerts.length} Active</span>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-5 md:p-6 border-l-4 border-error space-y-5">
              <p className="text-sm text-on-surface-variant font-label">Multiple consecutive absences detected. Recommended intervention required.</p>
              <div className="space-y-4">
                {enrichedAlerts.map(a => (
                  <Link key={`${a.studentId}-${a.courseId}`} href={`/students/${a.studentId}`} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center text-xs font-headline font-bold text-primary ring-2 ring-error/10 shrink-0">
                      {a.studentName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-on-surface truncate">{a.studentName}</p>
                        <span className="text-error font-black text-xs font-headline shrink-0">{a.absent}/{a.total} Missed</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-label">{a.courseName}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="w-full py-3 rounded-xl bg-surface-container text-on-surface-variant font-label font-bold text-[11px] uppercase tracking-widest border border-outline-variant/10 hover:text-on-surface transition-colors">
                Launch Outreach Program
              </button>
            </div>

            {/* Institution Health donut */}
            <div className="bg-surface-container-high rounded-2xl p-5 md:p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #141f38, #0f1930)' }}>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-secondary/10 rounded-full blur-[60px]" />
              <h4 className="text-sm font-bold font-headline mb-6">Institution Health</h4>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <ProgressNebula value={health} size={128} strokeWidth={8} />
                  <div className="absolute text-center">
                    <span className="text-2xl font-black font-headline block">{health}%</span>
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-label">Retention</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] text-on-surface-variant font-label mt-4">Total attendance across all courses is within target range.</p>
            </div>
          </div>

        </div>
      </div>
    </PrincipalShell>
  )
}
