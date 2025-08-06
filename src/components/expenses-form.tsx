import { useMemo, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ListPlusIcon, ListRestartIcon, UploadIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Expenses, expensesSchema } from '@/lib/validations/expenses'
import { getExpensesTableFormColumns } from '@/components/expenses-table-columns'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { createExpenses } from '@/app/actions/expenses'

interface ExpensesFormProps {
  close: () => void
}

const MAXIMUM_BATCH_SIZE = 25

export function ExpensesForm({ close }: ExpensesFormProps) {
  const defaultValues = useMemo(
    () => ({
      expenses: Array.from({ length: 5 }).map(() => ({
        amount: Number.NaN,
        category: '',
        currency: 'USD',
        date: dayjs().hour(12).minute(0).toISOString(),
        description: '',
        merchant: '',
        receipt: null,
        scanId: null
      }))
    }),
    []
  )

  const {
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<Expenses>({
    defaultValues,
    mode: 'onSubmit',
    resolver: zodResolver(expensesSchema)
  })

  const { append, fields, remove } = useFieldArray({
    control,
    name: 'expenses'
  })

  const columns = getExpensesTableFormColumns({
    control,
    errors,
    register,
    remove,
    setValue,
    watch
  })

  const table = useReactTable({
    columns,
    data: fields,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const [pending, startTransition] = useTransition()

  const onSubmit = ({ expenses }: Expenses) => {
    startTransition(async () => {
      const response = await createExpenses(expenses)

      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success(`Created ${expenses.length} expenses successfully!`)
        close?.()
      }
    })
  }

  return (
    <form
      className="h-full mt-2 pb-4 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ScrollArea className="max-h-[calc(100vh-20rem)]">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        className={cn({
                          'min-w-48 w-48': header.id === 'amount',
                          'min-w-52':
                            header.id === 'merchant' ||
                            header.id === 'description',
                          'w-44': header.id === 'date',
                          'w-8': header.id === 'actions'
                        })}
                        colSpan={header.colSpan}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows.map(row => (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      <div className="mt-auto flex flex-col gap-2.5 md:flex-row md:justify-end">
        <Button
          className="shadow-xs"
          disabled={pending || fields.length >= MAXIMUM_BATCH_SIZE}
          onClick={() => {
            append(defaultValues.expenses[0])
          }}
          type="button"
          variant="outline"
        >
          <ListPlusIcon /> Add Row
        </Button>
        <Button
          className="shadow-xs"
          disabled={pending || !isDirty}
          onClick={() => {
            reset(defaultValues)
          }}
          type="button"
          variant="outline"
        >
          <ListRestartIcon /> Reset
        </Button>

        <Button
          disabled={pending || !isDirty || !isValid}
          isLoading={pending}
          loadingText="Saving..."
          type="submit"
        >
          <UploadIcon /> Save
        </Button>
      </div>
    </form>
  )
}
