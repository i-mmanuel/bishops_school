import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AttendanceLoading() {
  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        {/* KPI cards */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        {/* Two-column layout */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
            <Skeleton className="h-6 w-48 mt-8" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-3xl" />
          ))}
        </div>
      </div>
    </PrincipalShell>
  )
}
