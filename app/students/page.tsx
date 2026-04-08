import PrincipalShell from '@/components/layout/PrincipalShell'
import { getStudents, getClasses, getChurchById, getDenominationById, getAttendanceRate, getStudentAvatarUrl } from '@/lib/mock-data'
import Link from 'next/link'
import Image from 'next/image'

export default function StudentsPage() {
  const allStudents = getStudents()
  const classes = getClasses()

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Students</h1>
            <p className="text-on-surface-variant font-label text-sm">{allStudents.length} students across {classes.length} classes</p>
          </div>
          <div className="hidden md:flex gap-4">
            {classes.map(cls => {
              const count = allStudents.filter(s => s.classId === cls.id).length
              return (
                <div key={cls.id} className="px-5 py-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-on-surface-variant text-xs block mb-0.5 font-label">{cls.name} Class</span>
                  <span className="text-2xl font-bold font-headline">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Classes */}
        <div className="space-y-12">
          {classes.map(cls => {
            const classStudents = allStudents.filter(s => s.classId === cls.id)
            return (
              <section key={cls.id}>
                {/* Class header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-black text-primary font-headline">{cls.name[0]}</span>
                  </div>
                  <h2 className="text-xl font-bold font-headline">{cls.name} Class</h2>
                  <span className="ml-2 text-xs font-label text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
                    {classStudents.length} students
                  </span>
                </div>

                {/* Student grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classStudents.map(student => {
                    const { rate } = getAttendanceRate(student.id)
                    const church = getChurchById(student.churchId)
                    const denomination = church ? getDenominationById(church.denominationId) : undefined
                    const rateColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-primary' : 'text-error'
                    const barColor = rate >= 80 ? 'bg-secondary' : rate >= 65 ? 'bg-primary' : 'bg-error'

                    return (
                      <Link
                        key={student.id}
                        href={`/students/${student.id}`}
                        className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 hover:bg-surface-container-highest transition-all duration-200 group"
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
                          <Image
                            src={getStudentAvatarUrl(student.id)}
                            alt={student.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-on-surface text-sm truncate group-hover:text-primary transition-colors">{student.name}</p>
                          <p className="text-xs text-on-surface-variant font-label truncate">{denomination?.abbreviation} · {church?.name.split(' ').slice(1).join(' ')}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rate}%` }} />
                            </div>
                            <span className={`text-xs font-bold font-label ${rateColor} shrink-0`}>{rate}%</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

      </div>
    </PrincipalShell>
  )
}
