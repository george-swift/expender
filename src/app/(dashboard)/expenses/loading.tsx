import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex col gap-2.5 pt-10 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end lg:top-0">
        <Skeleton className="w-40 h-8" />
        <Skeleton className="w-40 h-8" />
      </div>

      <Skeleton className="min-h-[300px]" />
    </div>
  )
}
