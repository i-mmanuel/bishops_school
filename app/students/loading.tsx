import PrincipalShell from '@/components/layout/PrincipalShell'
import { Skeleton } from '@/components/ui/Skeleton'

export default function StudentsLoading() {
  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div className="hidden md:flex gap-4">
            <Skeleton className="h-16 w-28 rounded-xl" />
            <Skeleton className="h-16 w-28 rounded-xl" />
          </div>
        </div>

        {/* Classes */}
        <div className="space-y-12">
          {Array.from({ length: 2 }).map((_, ci) => (
            <section key={ci}>
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-20 rounded-full ml-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="flex-1 h-1 rounded-full" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PrincipalShell>
  )
}
