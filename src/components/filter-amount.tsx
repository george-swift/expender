import { useEffect, useMemo, useState } from 'react'
import { useQueryState } from 'nuqs'

import { clamp, cn, currencyPatterns, formatters } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'

export function FilterAmount({ expenses }: { expenses: Expense[] }) {
  const [selectedCurrency] = useQueryState('currency', {
    defaultValue: 'USD',
    parse: (value): string => (value in currencyPatterns ? value : 'USD')
  })

  const expensesInSelectedCurrency = useMemo(() => {
    return expenses.filter(exp => (exp.currency || 'USD') === selectedCurrency)
  }, [expenses, selectedCurrency])

  // Compute min/max from data, fallback to [0, 0] if no data
  const [minAmount, maxAmount] = useMemo(() => {
    if (!expensesInSelectedCurrency.length) return [0, 0]

    const amounts = expensesInSelectedCurrency.map(exp => exp.amount)
    const min = Math.floor(Math.min(...amounts))
    const max = Math.ceil(Math.max(...amounts))
    return [min, max]
  }, [expensesInSelectedCurrency])

  // Query state for range, always clamp to min/max
  const [range, setRange] = useQueryState('amount_range', {
    defaultValue: `${minAmount}-${maxAmount}`,
    parse: value => {
      try {
        const [min, max] = value.split('-').map(Number)
        if (Number.isNaN(min) || Number.isNaN(max)) throw new TypeError()
        return `${Math.max(min, minAmount)}-${Math.min(max, maxAmount)}`
      } catch {
        return `${minAmount}-${maxAmount}`
      }
    },
    serialize: value => value
  })

  // Parse range to numbers, fallback to min/max
  const [min, max] = useMemo(() => {
    try {
      const [minVal, maxVal] = range.split('-').map(Number)
      return [Math.max(minVal, minAmount), Math.min(maxVal, maxAmount)]
    } catch {
      return [minAmount, maxAmount]
    }
  }, [range, minAmount, maxAmount])

  // Local state for slider/inputs
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  // Keep local state in sync with query state
  useEffect(() => {
    setLocalMin(min)
    setLocalMax(max)
  }, [min, max])

  // Slider change
  const handleValueChange = (value: number[]) => {
    setLocalMin(clamp(value[0], minAmount, maxAmount))
    setLocalMax(clamp(value[1], minAmount, maxAmount))
  }

  // Slider commit
  const handleValueCommit = (value: number[]) => {
    const clampedMin = clamp(value[0], minAmount, maxAmount)
    const clampedMax = clamp(value[1], minAmount, maxAmount)
    setRange(`${clampedMin}-${clampedMax}`)
  }

  // Preset click
  const handlePresetClick = (minPreset: number, maxPreset: number) => {
    const adjustedMin = clamp(minPreset, minAmount, maxAmount)
    const adjustedMax = clamp(maxPreset, minAmount, maxAmount)
    setLocalMin(adjustedMin)
    setLocalMax(adjustedMax)
    setRange(`${adjustedMin}-${adjustedMax}`)
  }

  // Input changes
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(e.target.value)
    if (Number.isNaN(newMin)) newMin = minAmount
    setLocalMin(newMin)
    setRange(`${newMin}-${localMax}`)
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(e.target.value)
    if (Number.isNaN(newMax)) newMax = maxAmount
    setLocalMax(newMax)
    setRange(`${localMin}-${newMax}`)
  }

  // Distribution of expenses by amount is a dynamically set histogram with at least 2 bins - 30 bins at most.
  const distributionData = useMemo(() => {
    const uniqueAmounts = new Set(
      expensesInSelectedCurrency.map(exp => exp.amount)
    )
    const numBins = Math.max(2, Math.min(30, uniqueAmounts.size))

    const range = maxAmount - minAmount
    const binSize = range > 0 ? range / numBins : 1
    const bins = Array.from({ length: numBins }).fill(0) as number[]

    expensesInSelectedCurrency.forEach(exp => {
      const binIndex =
        range === 0
          ? 0
          : Math.min(
              Math.floor((exp.amount - minAmount) / binSize),
              numBins - 1
            )
      bins[binIndex]++
    })

    const maxCount = Math.max(...bins) || 1
    return bins.map((count, index) => ({
      height: (count / maxCount) * 100,
      isInRange:
        minAmount + index * binSize >= localMin &&
        minAmount + (index + 1) * binSize <= localMax
    }))
  }, [expensesInSelectedCurrency, minAmount, maxAmount, localMin, localMax])

  const sliderValue = useMemo(() => [localMin, localMax], [localMin, localMax])

  const formatCurrencyAmount = (amount: number) =>
    formatters.currency({
      currency: selectedCurrency,
      maximumFractionDigits: 0,
      number: amount
    })

  const [currencySymbol] =
    currencyPatterns[selectedCurrency as keyof typeof currencyPatterns] ??
    currencyPatterns.USD

  // Only show preset options that overlap with user's min/max expense
  const presetOptions = useMemo(() => {
    const options = [
      { label: `Below ${currencySymbol}1,000`, min: minAmount, max: 1000 },
      {
        label: `Between ${currencySymbol}1,001 and ${currencySymbol}5,000`,
        min: 1001,
        max: 5000
      },
      {
        label: `Between ${currencySymbol}5,001 and ${currencySymbol}10,000`,
        min: 5001,
        max: 10_000
      }
    ]
    return options.filter(opt => opt.max >= minAmount && opt.min <= maxAmount)
  }, [currencySymbol, minAmount, maxAmount])

  return (
    <Popover>
      <PopoverTrigger asChild id="amount-filter">
        <Button
          className="w-full shadow-none font-normal justify-start rounded-lg lg:justify-center lg:w-fit"
          variant="outline"
        >
          {formatCurrencyAmount(localMin)} - {formatCurrencyAmount(localMax)}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="z-50 min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))] p-4 sm:min-w-72 lg:max-w-72"
      >
        <div className="flex h-12 items-end space-x-0.5">
          {distributionData.map((bin, index) => (
            <div
              className={cn(
                'w-full rounded-xs transition-all',
                bin.isInRange
                  ? 'bg-sidebar-primary'
                  : 'bg-gray-100 dark:bg-zinc-800'
              )}
              key={index}
              style={{ height: `${bin.height}%` }}
            />
          ))}
        </div>

        <Slider
          className="mt-4"
          max={maxAmount}
          min={minAmount}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          step={1}
          value={sliderValue}
        />

        <div className="mt-4 space-y-2">
          <p className="text-base sm:text-sm">Popular ranges:</p>
          {presetOptions.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No presets available for your data.
            </span>
          )}
          {presetOptions.map(option => (
            <Button
              className="w-full justify-start shadow-none font-normal"
              key={option.label}
              onClick={() => handlePresetClick(option.min, option.max)}
              variant="outline"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-base sm:text-sm">Custom range:</p>
          <div className="flex w-full items-center gap-2">
            <Input
              name="Minimum Amount"
              onChange={handleMinInputChange}
              placeholder={`$${minAmount}`}
              step={10}
              type="number"
              min={minAmount}
              max={localMax - 1}
              value={localMin}
            />
            <span className="text-xs text-muted-foreground">–</span>
            <Input
              name="Maximum Amount"
              onChange={handleMaxInputChange}
              placeholder={`$${maxAmount}`}
              step={10}
              type="number"
              min={localMin + 1}
              max={maxAmount}
              value={localMax}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
