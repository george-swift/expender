'use client'

import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { Column, createColumnHelper, Row } from '@tanstack/react-table'
import dayjs from 'dayjs'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyPlusIcon,
  FilePenLineIcon,
  MoreHorizontalIcon,
  TrashIcon
} from 'lucide-react'
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'

import { categories, cn, formatters } from '@/lib/utils'
import { Expense, Expenses } from '@/lib/validations/expenses'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface ExpensesTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

interface ExpensesTableColumnProps {
  onDeleteClick: (row: Row<Expense>) => void
  onDuplicateClick: (row: Row<Expense>) => void
  onEditClick: (row: Row<Expense>) => void
}

export function ExpensesTableColumnHeader<TData, TValue>({
  className,
  column,
  title
}: ExpensesTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  return (
    <button
      className="inline-flex cursor-pointer select-none items-center gap-2 rounded-md py-1"
      onClick={column.getToggleSortingHandler()}
    >
      <span>{title}</span>
      {column.getCanSort() ? (
        <div className="-space-y-2">
          <ChevronUpIcon
            aria-hidden="true"
            className={cn(
              'size-3.5 ',
              column.getIsSorted() === 'desc' ? 'opacity-30' : ''
            )}
          />
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              'size-3.5 ',
              column.getIsSorted() === 'asc' ? 'opacity-30' : ''
            )}
          />
        </div>
      ) : null}
    </button>
  )
}

const columnHelper = createColumnHelper<Expense>()

export const getExpensesTableColumns = ({
  onDeleteClick,
  onDuplicateClick,
  onEditClick
}: ExpensesTableColumnProps) => [
  columnHelper.display({
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={value => {
            row.toggleSelected(!!value)
          }}
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => {
            table.toggleAllPageRowsSelected(!!value)
          }}
        />
      </div>
    ),
    id: 'select'
  }),
  columnHelper.accessor('date', {
    cell: ({ getValue }) => {
      const date = getValue()
      return dayjs(date).format('MMMM D, YYYY')
    },
    enableHiding: false,
    enableSorting: true,
    header: ({ column }) => (
      <ExpensesTableColumnHeader column={column} title="Date" />
    )
  }),
  columnHelper.accessor('merchant', {
    enableSorting: false,
    filterFn: 'arrIncludesSome',
    header: ({ column }) => (
      <ExpensesTableColumnHeader
        className="min-w-28"
        column={column}
        title="Merchant"
      />
    )
  }),
  columnHelper.accessor('amount', {
    cell: ({ getValue, row }) => {
      return (
        <span className="font-medium">
          {formatters.currency({
            currency: row.original.currency,
            number: getValue()
          })}
        </span>
      )
    },
    enableSorting: true,
    header: ({ column }) => (
      <ExpensesTableColumnHeader column={column} title="Amount" />
    )
  }),
  columnHelper.accessor('category', {
    enableSorting: false,
    header: ({ column }) => (
      <ExpensesTableColumnHeader column={column} title="Category" />
    )
  }),
  columnHelper.accessor('description', {
    cell: ({ getValue }) => {
      return <div className="max-w-lg truncate">{getValue()}</div>
    },
    enableSorting: false,
    header: ({ column }) => (
      <ExpensesTableColumnHeader column={column} title="Description" />
    )
  }),
  columnHelper.display({
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
            variant="ghost"
          >
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => {
              onEditClick?.(row)
            }}
          >
            <FilePenLineIcon />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onDuplicateClick?.(row)
            }}
          >
            <CopyPlusIcon />
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              onDeleteClick?.(row)
            }}
          >
            <TrashIcon className="text-destructive" />
            <span className="text-destructive">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    id: 'actions'
  })
]

const MINIMUM_BATCH_SIZE = 5

export const getExpensesTableFormColumns = ({
  control,
  errors,
  register,
  remove,
  setValue,
  watch
}: {
  control: Control<Expenses, unknown, FieldValues>
  errors: FieldErrors<Expenses>
  register: UseFormRegister<Expenses>
  remove: UseFieldArrayRemove
  setValue: UseFormSetValue<Expenses>
  watch: UseFormWatch<Expenses>
}) => [
  columnHelper.display({
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`expenses.${row.index}.date`}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="date">
              Date
            </Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    'pl-3 text-left font-normal shadow-xs',
                    !field.value && 'text-muted-foreground'
                  )}
                  variant="outline"
                >
                  {field.value ? (
                    dayjs(field.value).format('MMMM D, YYYY')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-auto p-0 z-100"
                onOpenAutoFocus={e => {
                  e.preventDefault()
                }}
              >
                <Calendar
                  captionLayout="dropdown"
                  defaultMonth={dayjs(field.value).toDate()}
                  endMonth={dayjs().add(5, 'year').endOf('year').toDate()}
                  mode="single"
                  onSelect={value => {
                    const normalizedDate = dayjs(value)
                      .hour(12)
                      .minute(0)
                      .second(0)
                      .millisecond(0)
                      .toISOString()
                    field.onChange(normalizedDate)
                  }}
                  selected={dayjs(field.value).toDate()}
                  startMonth={dayjs()
                    .subtract(5, 'year')
                    .startOf('year')
                    .toDate()}
                />
              </PopoverContent>
            </Popover>
            {errors?.expenses?.[row.index]?.date && (
              <p className="text-destructive text-sm">
                {errors?.expenses?.[row.index]?.date?.message}
              </p>
            )}
          </div>
        )}
      />
    ),
    header: 'Date',
    id: 'date'
  }),
  columnHelper.display({
    cell: ({ row }) => (
      <div className="grid gap-2">
        <Label className="sr-only" htmlFor="merchant">
          Merchant
        </Label>
        <Input
          aria-invalid={!!errors?.expenses?.[row.index]?.merchant}
          id="merchant"
          placeholder="Merchant e.g, Amazon"
          {...register(`expenses.${row.index}.merchant`)}
        />
        {errors?.expenses?.[row.index]?.merchant && (
          <p className="text-destructive text-sm">
            {errors?.expenses?.[row.index]?.merchant?.message}
          </p>
        )}
      </div>
    ),
    header: 'Merchant',
    id: 'merchant'
  }),
  columnHelper.display({
    cell: ({ row }) => (
      <div className="grid gap-2">
        <Label className="sr-only" htmlFor="amount">
          Amount
        </Label>
        <Input
          aria-invalid={!!errors?.expenses?.[row.index]?.amount}
          currency={watch(`expenses.${row.index}.currency`, 'USD')}
          id="amount"
          min={0}
          onCurrencyChange={value => {
            setValue(`expenses.${row.index}.currency`, value, {
              shouldDirty: true,
              shouldValidate: true
            })
          }}
          placeholder="0.00"
          step="any"
          type="number"
          {...register(`expenses.${row.index}.amount`, { valueAsNumber: true })}
        />
        {errors?.expenses?.[row.index]?.amount && (
          <p className="text-destructive text-sm">
            {errors?.expenses?.[row.index]?.amount?.message}
          </p>
        )}
      </div>
    ),
    header: 'Amount',
    id: 'amount'
  }),
  columnHelper.display({
    cell: ({ row }) => (
      <Controller
        control={control}
        name={`expenses.${row.index}.category`}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="category">
              Category
            </Label>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full shadow-xs">
                <SelectValue id="category" placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-80">
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            {errors?.expenses?.[row.index]?.category && (
              <p className="text-destructive text-sm">
                {errors?.expenses?.[row.index]?.category?.message}
              </p>
            )}
          </div>
        )}
      />
    ),
    header: 'Category',
    id: 'category'
  }),
  columnHelper.display({
    cell: ({ row }) => (
      <div className="grid gap-2">
        <Label className="sr-only" htmlFor="description">
          Description
        </Label>
        <Input
          aria-invalid={!!errors?.expenses?.[row.index]?.description}
          className="resize-none"
          id="description"
          placeholder="Brief description"
          {...register(`expenses.${row.index}.description`)}
        />
        {errors?.expenses?.[row.index]?.description && (
          <p className="text-destructive text-sm">
            {errors?.expenses?.[row.index]?.description?.message}
          </p>
        )}
      </div>
    ),
    header: 'Description',
    id: 'description'
  }),
  columnHelper.display({
    cell: ({ row }) => (
      <Button
        className={cn('text-muted-foreground hover:bg-transparent', {
          hidden: row.index < MINIMUM_BATCH_SIZE
        })}
        onClick={() => {
          remove(row.index)
        }}
        size="icon"
        variant="ghost"
      >
        <TrashIcon />
        <span className="sr-only">Delete row</span>
      </Button>
    ),
    id: 'actions'
  })
]
