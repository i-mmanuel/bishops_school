import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeacherClassLoading() {
  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-4xl mx-auto">
        {/* Back */}
        <Skeleton className="h-3 w-20 mb-6" />

        {/* Hero */}
        <div className="flex items-center gap-5 mb-8">
          <Skeleton className="w-16 h-16 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl p-4 border border-white/[0.07] space-y-2"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          ))}
        </div>

        {/* Module breakdowns */}
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              {/* Module header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              {/* Session rows */}
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-1 w-full rounded-full" />
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-5 w-12" />
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PrincipalShell>
  )
}
