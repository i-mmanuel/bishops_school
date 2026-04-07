import type { Course } from '@/lib/types'
import Link from 'next/link'
import ProgressNebula from './ProgressNebula'

interface Props { course: Course; avgRate: number }

export default function CourseCard({ course, avgRate }: Props) {
  const scheduleLabel = `${course.schedule.days.join(', ')} · ${course.schedule.time}`
  return (
    <Link href={`/courses/${course.id}`}
      className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl hover:bg-surface-bright transition-colors duration-200">
      <ProgressNebula value={avgRate} size={48} strokeWidth={4} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-headline font-bold text-on-surface truncate">{course.name}</p>
        <p className="text-xs font-label text-on-surface-variant mt-0.5 truncate">{scheduleLabel}</p>
        <p className="text-xs font-label text-on-surface-variant">{course.studentIds.length} students</p>
      </div>
      <span className="text-lg font-headline font-bold text-secondary shrink-0">{avgRate}%</span>
    </Link>
  )
}
