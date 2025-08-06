import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Skeleton className="min-h-[200px] rounded-xl" />
      <Skeleton className="min-h-[200px] rounded-xl" />
      <Skeleton className="min-h-[200px] rounded-xl" />
    </div>
  )
}
