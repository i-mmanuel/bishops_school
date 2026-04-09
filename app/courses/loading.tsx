import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function CoursesLoading() {
  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        {/* Desktop header */}
        <div className="hidden md:flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="space-y-2">
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-20 w-40 rounded-xl" />
            <Skeleton className="h-20 w-40 rounded-xl" />
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden mb-6">
          <Skeleton className="h-8 w-52" />
        </div>

        {/* Filter bar */}
        <Skeleton className="hidden md:block h-14 w-full rounded-2xl mb-8" />

        {/* Mobile search */}
        <Skeleton className="md:hidden h-12 w-full rounded-xl mb-6" />

        {/* Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 border border-white/[0.07] space-y-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center justify-between">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-1.5 w-24 rounded-full" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </PrincipalShell>
  )
}
