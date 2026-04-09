import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-40" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="col-span-2 h-36 rounded-2xl" />
          <Skeleton className="col-span-2 h-36 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>

        {/* Teacher performance */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/[0.06] space-y-3"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrincipalShell>
  )
}
