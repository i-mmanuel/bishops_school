import type { CriticalAlert } from '@/lib/types'
import { Warning } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function CriticalAlertCard({ alert }: { alert: CriticalAlert }) {
  return (
    <Link href={`/students/${alert.studentId}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high hover:bg-surface-bright transition-colors duration-200 group">
      <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
        <Warning size={16} weight="fill" className="text-tertiary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-label font-semibold text-on-surface truncate">{alert.studentName}</p>
        <p className="text-xs font-label text-on-surface-variant truncate">{alert.courseName}</p>
      </div>
      <span className="text-sm font-headline font-bold text-tertiary shrink-0">{alert.rate}%</span>
    </Link>
  )
}
