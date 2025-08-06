'use client'

import { useCallback, useState, useTransition } from 'react'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns2Icon,
  FileSpreadsheetIcon,
  TrashIcon
} from 'lucide-react'
import { toast } from 'sonner'

import { cn, formatters } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { useDialog } from '@/hooks/use-dialog'
import { ExpenseForm } from '@/components/expense-form'
import { getExpensesTableColumns } from '@/components/expenses-table-columns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  createExpense,
  deleteExpense,
  deleteExpenses,
  exportExpenses
} from '@/app/actions/expenses'

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25]

interface ExpensesTableCellProps {
  close: () => void
  expense: Expense | undefined
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function ExpensesTableCell({
  close,
  expense,
  isOpen,
  onOpenChange
}: ExpensesTableCellProps) {
  if (!expense) {
    return null
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={isOpen}>
      <SheetContent className="flex flex-col pt-7" side="right">
        <SheetHeader className="gap-1">
          <SheetTitle className="flex w-full items-center justify-between">
            <span>{expense.merchant}</span>
            <span>
              {formatters.currency({
                currency: expense.currency,
                number: expense.amount
              })}
            </span>
          </SheetTitle>
          <SheetDescription>
            {dayjs(expense.date).format('MMMM D, YYYY')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 -mt-4 px-4 pb-4 overflow-y-scroll">
          <Tabs className="h-full" defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger disabled={true} value="history">
                <div>History</div>
                <Badge variant="outline">Upcoming feature</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <ExpenseForm close={close} expense={expense} />
            </TabsContent>
            <TabsContent value="history">History of expense here.</TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ExpensesTable({ data }: { data: Expense[] }) {
  const [row, setRow] = useState<null | Row<Expense>>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const [inEdit, setInEdit] = useState(false)
  const closeEdit = useCallback(() => setInEdit(false), [])

  const confirmationDialog = useDialog()

  const columns = getExpensesTableColumns({
    onDeleteClick: row => {
      setRow(row)
      confirmationDialog.trigger()
    },
    onDuplicateClick: async row => {
      toast.info('Duplicating expense...')

      const response = await createExpense({
        amount: row.original.amount,
        category: row.original.category,
        currency: row.original.currency,
        date: row.original.date,
        description: row.original.description,
        merchant: row.original.merchant,
        receipt: row.original.receipt,
        scanId: row.original.scanId ?? null
      })

      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success('Expense duplicated successfully!')
      }
    },
    onEditClick: row => {
      setRow(row)
      setInEdit(true)
    }
  })

  const table = useReactTable({
    columns,
    data,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: row => row.expenseId!,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting
    }
  })

  const [pendingExport, startExportTransition] = useTransition()

  const handleExport = () => {
    startExportTransition(async () => {
      const attributes = table.getAllColumns().reduce(
        (acc, column) => {
          if (
            column.accessorFn &&
            column.getCanHide() &&
            column.getIsVisible()
          ) {
            acc.push(column.id as keyof Expense)
          }
          return acc
        },
        [] as (keyof Expense)[]
      )

      const { data, error } = await exportExpenses({
        format: 'csv',
        attributes
      })

      if (error && !data) {
        toast.error(error)
        return
      }

      const url = URL.createObjectURL(data!)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Expenses.csv`)
      document.body.append(link)
      link.click()
      link.remove()
      toast.success('Expenses exported successfully!')
    })
  }

  const [pendingDelete, startDeleteTransition] = useTransition()

  const handleDeleteExpense = () => {
    startDeleteTransition(async () => {
      if (!row) return

      const response = await deleteExpense(row.original.expenseId!)

      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success('Expense deleted successfully.')
        setRow(null)
      }

      confirmationDialog.dismiss()
    })
  }

  const handleDeleteExpenses = () => {
    startDeleteTransition(async () => {
      const expenseIds = table
        .getSelectedRowModel()
        .rows.map(row => row.original.expenseId!)

      if (!expenseIds.length) {
        return
      }

      const response = await deleteExpenses(expenseIds)

      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success('Selected expenses deleted successfully.')
        setRow(null)
        setRowSelection({})
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end w-full gap-2">
        {(table.getIsAllPageRowsSelected() ||
          table.getIsSomePageRowsSelected()) && (
          <Button
            className="text-white"
            isLoading={pendingDelete}
            loadingText="Deleting..."
            onClick={handleDeleteExpenses}
            size="sm"
            variant="destructive"
          >
            <TrashIcon />
            <span>Delete</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="shadow-xs" size="sm" variant="outline">
              <Columns2Icon />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {table
              .getAllColumns()
              .filter(column => column.accessorFn && column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                    onCheckedChange={value => {
                      column.toggleVisibility(!!value)
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="shadow-xs"
          disabled={!data.length}
          isLoading={pendingExport}
          loadingText="Exporting..."
          onClick={handleExport}
          size="sm"
          variant="outline"
        >
          <FileSpreadsheetIcon />
          <span>Export to CSV</span>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      className={cn({
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label className="text-sm font-medium" htmlFor="rows-per-page">
              Rows per page
            </Label>
            <Select
              onValueChange={value => {
                table.setPageSize(Number(value))
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map(pageSize => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.setPageIndex(0)
              }}
              variant="outline"
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage()
              }}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage()
              }}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              className="hidden size-8 lg:flex"
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1)
              }}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <ExpensesTableCell
        close={closeEdit}
        expense={row?.original}
        isOpen={inEdit}
        onOpenChange={setInEdit}
      />

      <Dialog {...confirmationDialog.dialogProps}>
        <DialogContent>
          <DialogHeader className="items-center">
            <FileSpreadsheetIcon className="size-8 mb-2" />
            <DialogTitle>Confirm Expense Deletion</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 grid-cols-2">
            <Button
              onClick={confirmationDialog.dismiss}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              isLoading={pendingDelete}
              onClick={handleDeleteExpense}
              variant="destructive"
            >
              Delete Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
