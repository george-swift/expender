import { useMemo, useTransition } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import {
  CalendarIcon,
  DownloadIcon,
  EraserIcon,
  FileSpreadsheetIcon,
  Trash2Icon,
  UploadIcon
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { categories, cn, formatters } from '@/lib/utils'
import { Expense, expenseSchema } from '@/lib/validations/expenses'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Textarea } from '@/components/ui/textarea'
import { createExpense, updateExpense } from '@/app/actions/expenses'

interface ExpenseFormProps {
  close?: () => void
  expense?: Expense
  inSmartScanMode?: boolean
}

export function ExpenseForm({
  close,
  expense,
  inSmartScanMode = false
}: ExpenseFormProps) {
  const defaultValues = useMemo(
    () => ({
      amount: expense?.amount ?? Number.NaN,
      category: expense?.category ?? '',
      currency: expense?.currency ?? 'USD',
      date: expense?.date ?? dayjs().hour(12).minute(0).toISOString(),
      description: expense?.description ?? '',
      expenseId: expense?.expenseId ?? undefined,
      merchant: expense?.merchant ?? '',
      receipt: expense?.receipt ?? null,
      scanId: expense?.scanId ?? null
    }),
    [expense]
  )

  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<Expense>({
    defaultValues,
    mode: 'all',
    resolver: zodResolver(expenseSchema)
  })

  const formValues = watch()

  const updateField = (name: keyof Expense, value: Expense[keyof Expense]) => {
    setValue(name, value, { shouldDirty: true, shouldValidate: true })
  }

  const [pending, startTransition] = useTransition()

  const onSubmit = (data: Expense) => {
    startTransition(async () => {
      const mutation = expense?.expenseId ? updateExpense : createExpense
      const response = await mutation(data)

      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success(
          `Expense ${expense?.expenseId ? 'updated' : 'created'} successfully!`
        )
        close?.()
      }
    })
  }

  const onReset = () => {
    reset(defaultValues)

    if (inSmartScanMode) {
      close?.()
      toast.info('Exited Smart Scan mode', {
        description:
          'Unsaved scan result will be automatically deleted in the next hour.'
      })
    }
  }

  return (
    <form
      className="h-[calc(100%_-_3rem)] mt-2 pb-4 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {formValues?.receipt && (
        <div className="grid gap-2">
          <div className="text-sm leading-none font-medium select-none">
            Receipt
          </div>
          <div className="relative rounded-lg px-2 py-4 border shadow-xs border-input flex items-center gap-3 sm:px-4">
            <div className="order-1 shrink-0">
              {!inSmartScanMode && (
                <Button
                  aria-label="Remove file"
                  className="hover:text-destructive"
                  onClick={() => {
                    updateField('receipt', null)
                  }}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2Icon aria-hidden="true" className="size-5 shrink-0" />
                </Button>
              )}
              <Link
                aria-label="Download file"
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost'
                })}
                download={true}
                href={formValues?.receipt.url}
                target="_blank"
              >
                <DownloadIcon aria-hidden="true" className="size-5 shrink-0" />
              </Link>
            </div>
            <div className="grow flex items-center space-x-3 truncate">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                <FileSpreadsheetIcon aria-hidden={true} className="size-5 " />
              </span>
              <div className="truncate">
                <p className="line-clamp-1 truncate text-xs font-medium ">
                  <span>{formValues.receipt.name}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatters.fileSize(formValues.receipt.size)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid gap-2 w-full md:w-1/2">
          <Label htmlFor="date">Date</Label>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  'pl-3 text-left font-normal shadow-xs',
                  !formValues.date && 'text-muted-foreground'
                )}
                variant="outline"
              >
                {formValues.date ? (
                  dayjs(formValues.date).format('MMMM D, YYYY')
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
                defaultMonth={dayjs(formValues.date).toDate()}
                endMonth={dayjs().add(5, 'year').endOf('year').toDate()}
                mode="single"
                onSelect={value => {
                  const normalizedDate = dayjs(value)
                    .hour(12)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toISOString()
                  updateField('date', normalizedDate)
                }}
                selected={dayjs(formValues.date).toDate()}
                startMonth={dayjs()
                  .subtract(5, 'year')
                  .startOf('year')
                  .toDate()}
              />
            </PopoverContent>
          </Popover>
          {errors?.date && (
            <p className="text-destructive text-sm">{errors?.date?.message}</p>
          )}
        </div>

        <div className="w-full grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            aria-invalid={!!errors?.amount}
            currency={formValues.currency}
            id="amount"
            min={0}
            onCurrencyChange={value => {
              updateField('currency', value)
            }}
            placeholder="0.00"
            step="any"
            type="number"
            onChange={e =>
              updateField('amount', parseFloat(e.target.value) || 0)
            }
            value={formValues.amount || ''}
          />
          {errors?.amount && (
            <p className="text-destructive text-sm">
              {errors?.amount?.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="merchant">Merchant</Label>
        <Input
          aria-invalid={!!errors?.merchant}
          id="merchant"
          placeholder="Merchant name e.g, Amazon"
          {...register('merchant')}
        />
        {errors?.merchant && (
          <p className="text-destructive text-sm">
            {errors?.merchant?.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formValues.category}
          onValueChange={value => {
            updateField('category', value)
          }}
        >
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
        {errors?.category && (
          <p className="text-destructive text-sm">
            {errors?.category?.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          aria-invalid={!!errors?.description}
          className="resize-none"
          id="description"
          placeholder="Add a short description to help you remember this expense later"
          {...register('description')}
        />
        {errors?.description && (
          <p className="text-destructive text-sm">
            {errors?.description?.message}
          </p>
        )}
      </div>

      <div
        className={cn('mt-auto flex flex-col gap-2.5', {
          'flex-col-reverse': expense,
          'md:flex-row md:justify-end': !expense
        })}
      >
        <Button
          className="shadow-xs"
          disabled={pending || (!inSmartScanMode && !isDirty)}
          onClick={onReset}
          type="button"
          variant="outline"
        >
          <EraserIcon />
          {inSmartScanMode ? 'Delete and exit' : ' Clear'}
        </Button>

        <Button
          disabled={pending || (!inSmartScanMode && !isDirty) || !isValid}
          isLoading={pending}
          loadingText={expense?.expenseId ? 'Saving changes...' : 'Saving...'}
          type="submit"
        >
          <UploadIcon />{' '}
          {inSmartScanMode
            ? 'Confirm and save'
            : `Save${expense?.expenseId ? ' changes' : ''}`}
        </Button>
      </div>
    </form>
  )
}
