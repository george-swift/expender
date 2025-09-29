import * as React from 'react'

import { cn, currencyPatterns } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface CurrencyInputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  currency: string
  onChange?: (value: string) => void
  onCurrencyChange: (currency: string) => void
}

interface InputProps extends React.ComponentProps<'input'> {
  currency?: Expense['currency']
  onCurrencyChange?: (currency: string) => void
}

export function CurrencyInput({
  className,
  currency,
  disabled,
  onChange,
  onCurrencyChange,
  type = 'number',
  ...props
}: CurrencyInputProps) {
  const currencies = Object.keys(currencyPatterns)

  const [symbol] =
    currencyPatterns[currency as keyof typeof currencyPatterns] ??
    currencyPatterns.USD

  return (
    <div className="grid grid-cols-[1fr_80px] w-full gap-2">
      <div
        className={cn(
          'flex items-center rounded-md px-3 dark:bg-input/30 border-input h-9 w-full min-w-0 border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40 focus-within:border-destructive':
              props['aria-invalid']
          },
          className
        )}
      >
        <div className="shrink-0 text-base text-muted-foreground select-none sm:text-sm/6">
          {symbol}
        </div>
        <input
          className={cn(
            'block min-w-0 grow py-1.5 pr-3 pl-1 text-base placeholder:text-muted-foreground focus:outline-none sm:text-sm/6',
            {
              '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none':
                type === 'number'
            }
          )}
          data-slot="input"
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          type={type}
          {...props}
        />
      </div>

      <Select
        disabled={disabled}
        onValueChange={onCurrencyChange}
        value={currency}
      >
        <SelectTrigger
          aria-label="Select currency"
          className="w-[80px] shrink-0"
        >
          <SelectValue placeholder="USD" />
        </SelectTrigger>
        <SelectContent className="min-w-[80px]">
          <ScrollArea className="h-60">
            {currencies.map(currencyCode => (
              <SelectItem key={currencyCode} value={currencyCode}>
                {currencyCode}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  )
}

export function Input({
  className,
  currency,
  onChange,
  onCurrencyChange,
  type,
  ...props
}: InputProps) {
  if (currency && onCurrencyChange) {
    return (
      <CurrencyInput
        currency={currency}
        onChange={value => {
          if (onChange) {
            const mockEvent = {
              target: { value }
            } as React.ChangeEvent<HTMLInputElement>
            onChange(mockEvent)
          }
        }}
        onCurrencyChange={onCurrencyChange}
        type={type}
        {...props}
      />
    )
  }

  return (
    <input
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
        {
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none':
            type === 'number'
        }
      )}
      data-slot="input"
      onChange={onChange}
      type={type}
      {...props}
    />
  )
}
