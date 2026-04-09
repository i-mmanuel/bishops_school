import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeachersLoading() {
  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Teacher cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/[0.07] space-y-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-2.5 w-16" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                ))}
              </div>
              {/* Progress bars */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-2.5 w-36" />
                  <Skeleton className="h-2.5 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PrincipalShell>
  )
}
