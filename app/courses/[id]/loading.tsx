import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function CourseDetailLoading() {
  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* Desktop */}
        <div className="hidden md:block">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>

          {/* Title + actions */}
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-11 w-32 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/[0.07] space-y-4"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center justify-between">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/[0.07] overflow-hidden mb-10"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="px-8 py-6 border-b border-white/[0.06] grid grid-cols-4 gap-4">
              {['Student Name', 'Last Session', 'Overall Rate', 'Actions'].map((_, i) => (
                <Skeleton key={i} className="h-3 w-24" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-8 py-5 border-b border-white/[0.04] grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-6 ml-auto rounded" />
              </div>
            ))}
          </div>

          {/* Topic progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="rounded-xl border border-white/[0.07] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-4">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-6 gap-3">
            <Skeleton className="col-span-6 h-28 rounded-xl" />
            <Skeleton className="col-span-3 h-24 rounded-xl" />
            <Skeleton className="col-span-3 h-24 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-36" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </PrincipalShell>
  )
}
