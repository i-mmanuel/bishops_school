import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { teacherAvatar } from '@/lib/teacher-avatars'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr'
import ModuleAccordion from './ModuleAccordion'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
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
                Lesson coverage across all modules
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl md:text-4xl font-black font-headline text-primary-dim">
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
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dim"
              style={{ width: `${coverage.rate}%` }}
            />
          </div>
        </div>

        {/* Empty state */}
        {coverage.modules.length === 0 ? (
          <div
            className="rounded-2xl border border-white/[0.07] p-8 text-center"
            style={glassCard}
          >
            <p className="text-on-surface-variant/70 font-label text-sm">
              No modules in the system yet.
            </p>
          </div>
        ) : (
          <ModuleAccordion modules={coverage.modules} />
        )}
      </div>
    </PrincipalShell>
  )
}
