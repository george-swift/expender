import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="sticky top-10 flex col gap-6 pt-10 pb-6 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:top-0">
        <Skeleton className="h-4" />

        <div className="grid w-full grid-cols-3 gap-3 max-w-3xl">
          <Skeleton className="h-10" />
          <Skeleton className="h-10 max-lg:hidden" />
          <Skeleton className="h-10 max-lg:hidden" />
        </div>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
      </div>

      <Skeleton className="min-h-[300px] flex-1" />
    </div>
  )
}
