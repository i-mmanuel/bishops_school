import type { ApiModule } from '@/lib/api-types'
import Link from 'next/link'
import { BookOpen } from '@phosphor-icons/react/dist/ssr'

interface Props { course: ApiModule; hasSessions?: boolean }

export default function CourseCard({ course, hasSessions = false }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="rounded-2xl p-6 flex items-center gap-4 border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 group relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {/* Shimmer top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-primary/10 text-primary-dim"
        style={{ boxShadow: '0 0 16px rgba(124,58,237,0.25)' }}
      >
        <BookOpen size={20} />
      </div>
      <h3 className="text-lg font-bold font-headline text-on-surface leading-tight flex-1 min-w-0">{course.name}</h3>
      {hasSessions && (
        <span className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold uppercase tracking-wider font-label text-secondary-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-dim" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.6)' }} />
          In Progress
        </span>
      )}
    </Link>
  )
}
