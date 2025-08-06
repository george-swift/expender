import { getExpenses } from '@/lib/api/expenses'
import { DashboardCharts } from '@/components/dashboard-charts'
import { DashboardFilters } from '@/components/dashboard-filters'

export default async function DashboardPage() {
  const { data, error } = await getExpenses()

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">Error fetching expenses</h2>
        <p className="text-muted-foreground">
          Please try again later or contact support.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardFilters expenses={data} />
      <DashboardCharts expenses={data} />
    </div>
  )
}
