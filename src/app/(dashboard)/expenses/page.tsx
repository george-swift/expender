import { getExpenses } from '@/lib/api/expenses'
import { ExpensesTable } from '@/components/expenses-table'

export default async function ExpensesPage() {
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

  if (!data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">No expenses found.</h2>
      </div>
    )
  }

  return (
    <div className="pt-10 pb-6 px-4 lg:px-6">
      <ExpensesTable data={data} />
    </div>
  )
}
