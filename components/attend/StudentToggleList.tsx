'use client'
import type { Student } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface Props {
  students: Student[]
  statuses: Record<string, 'present' | 'absent'>
  onToggle: (studentId: string) => void
}

export default function StudentToggleList({ students, statuses, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {students.map(student => {
        const status = statuses[student.id] ?? 'present'
        return (
          <button key={student.id} onClick={() => onToggle(student.id)}
            className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98]
              ${status === 'absent' ? 'bg-tertiary/5 border border-tertiary/20' : 'bg-surface-container-high border border-transparent hover:bg-surface-bright'}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-headline font-bold shrink-0
              ${status === 'absent' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-highest text-primary'}`}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="flex-1 text-sm font-label font-semibold text-on-surface">{student.name}</span>
            <StatusBadge status={status} />
          </button>
        )
      })}
    </div>
  )
}
