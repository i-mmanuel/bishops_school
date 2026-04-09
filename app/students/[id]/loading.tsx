import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function StudentProfileLoading() {
  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* Desktop hero */}
        <section className="hidden md:grid grid-cols-12 gap-8 items-end mb-8">
          <div className="col-span-8 flex items-end gap-8">
            <Skeleton className="w-48 h-48 rounded-xl shrink-0" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-12 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-32 rounded-full" />
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </section>

        {/* Desktop stat bento */}
        <section className="hidden md:grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </section>

        {/* Desktop module breakdown */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <div className="rounded-xl border border-white/[0.07] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 border-b border-white/[0.04] flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <div className="space-y-2 w-48">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile hero */}
        <section className="md:hidden flex flex-col items-center text-center space-y-4 mb-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 mx-auto" />
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
        </section>

        {/* Mobile stats */}
        <section className="md:hidden space-y-3 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-16 rounded-xl" />
        </section>

        {/* Mobile modules */}
        <section className="md:hidden space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="rounded-xl p-6 space-y-5 border border-white/[0.07]"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </PrincipalShell>
  )
}
