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
import {
  ListPlusIcon,
  ListRestartIcon,
  TrashIcon,
  UploadIcon
} from 'lucide-react'
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { toast } from 'sonner'

import { categories, cn } from '@/lib/utils'
import { Expenses, expensesSchema } from '@/lib/validations/expenses'
import { useIsMobile } from '@/hooks/use-mobile'
import { getExpensesTableFormColumns } from '@/components/expenses-table-columns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const MINIMUM_BATCH_SIZE = 5
const MAXIMUM_BATCH_SIZE = 25

// Mobile Card Component for individual expense entry
function ExpenseCard({
  index,
  control,
  register,
  setValue,
  watch,
  errors,
  onRemove,
  canRemove
}: {
  index: number
  control: Control<Expenses, unknown, FieldValues>
  errors: FieldErrors<Expenses>
  register: UseFormRegister<Expenses>
  setValue: UseFormSetValue<Expenses>
  watch: UseFormWatch<Expenses>
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-2">
        <CardTitle className="text-sm">Expense #{index + 1}</CardTitle>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Remove expense</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor={`date-${index}`}>Date</Label>
          <Controller
            control={control}
            name={`expenses.${index}.date`}
            render={({ field }) => (
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                    id={`date-${index}`}
                  >
                    {field.value ? (
                      dayjs(field.value).format('MMMM D, YYYY')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dayjs(field.value).toDate()}
                    onSelect={value => {
                      const normalizedDate = dayjs(value)
                        .hour(12)
                        .minute(0)
                        .second(0)
                        .millisecond(0)
                        .toISOString()
                      field.onChange(normalizedDate)
                    }}
                    defaultMonth={dayjs(field.value).toDate()}
                    captionLayout="dropdown"
                    startMonth={dayjs()
                      .subtract(5, 'year')
                      .startOf('year')
                      .toDate()}
                    endMonth={dayjs().add(5, 'year').endOf('year').toDate()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors?.expenses?.[index]?.date && (
            <p className="text-sm text-destructive">
              {errors?.expenses?.[index]?.date?.message}
            </p>
          )}
        </div>

        {/* Merchant */}
        <div className="space-y-2">
          <Label htmlFor={`merchant-${index}`}>Merchant</Label>
          <Input
            id={`merchant-${index}`}
            placeholder="e.g., Amazon, Starbucks"
            {...register(`expenses.${index}.merchant`)}
            aria-invalid={!!errors?.expenses?.[index]?.merchant}
          />
          {errors?.expenses?.[index]?.merchant && (
            <p className="text-sm text-destructive">
              {errors?.expenses?.[index]?.merchant?.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor={`amount-${index}`}>Amount</Label>
          <Input
            id={`amount-${index}`}
            type="number"
            step="any"
            min={0}
            placeholder="0.00"
            currency={watch(`expenses.${index}.currency`, 'USD')}
            onCurrencyChange={value => {
              setValue(`expenses.${index}.currency`, value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }}
            {...register(`expenses.${index}.amount`, { valueAsNumber: true })}
            aria-invalid={!!errors?.expenses?.[index]?.amount}
          />
          {errors?.expenses?.[index]?.amount && (
            <p className="text-sm text-destructive">
              {errors?.expenses?.[index]?.amount?.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2 w-full">
          <Label htmlFor={`category-${index}`}>Category</Label>
          <Controller
            control={control}
            name={`expenses.${index}.category`}
            render={({ field }) => (
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={`category-${index}`} className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {categories.map((category, categoryIndex) => (
                      <SelectItem key={categoryIndex} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
          />
          {errors?.expenses?.[index]?.category && (
            <p className="text-sm text-destructive">
              {errors?.expenses?.[index]?.category?.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor={`description-${index}`}>Description</Label>
          <Input
            id={`description-${index}`}
            placeholder="Brief description"
            {...register(`expenses.${index}.description`)}
            aria-invalid={!!errors?.expenses?.[index]?.description}
          />
          {errors?.expenses?.[index]?.description && (
            <p className="text-sm text-destructive">
              {errors?.expenses?.[index]?.description?.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ExpensesForm({ close }: ExpensesFormProps) {
  const isMobile = useIsMobile()

  const defaultValues = useMemo(
    () => ({
      expenses: Array.from({ length: MINIMUM_BATCH_SIZE }).map(() => ({
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

  // Mobile Layout
  if (isMobile) {
    return (
      <form
        className="h-full mt-2 pb-4 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ScrollArea className="max-h-[calc(100vh-20rem)]">
          <div className="space-y-4 px-1">
            {fields.map((field, index) => (
              <ExpenseCard
                key={field.id}
                index={index}
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                onRemove={() => remove(index)}
                canRemove={index >= MINIMUM_BATCH_SIZE}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="mt-auto flex flex-col gap-2.5">
          <Button
            className="shadow-xs"
            disabled={pending || fields.length >= MAXIMUM_BATCH_SIZE}
            onClick={() => {
              append(defaultValues.expenses[0])
            }}
            type="button"
            variant="outline"
          >
            <ListPlusIcon className="mr-2 h-4 w-4" />
            Add Expense
          </Button>

          <div className="flex gap-2.5">
            <Button
              className="shadow-xs flex-1"
              disabled={pending || !isDirty}
              onClick={() => {
                reset(defaultValues)
              }}
              type="button"
              variant="outline"
            >
              <ListRestartIcon className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              disabled={pending || !isDirty || !isValid}
              isLoading={pending}
              loadingText="Saving..."
              type="submit"
              className="flex-1"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </form>
    )
  }

  // Desktop Layout (existing table layout)
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
