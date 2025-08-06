import { useMemo } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useQueryState } from 'nuqs'

import { currencyPatterns } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { DATE_RANGES, DEFAULT_RANGE, RangeKey } from '@/components/filter-date'

dayjs.extend(isBetween)

type UseExpensesResult = {
  areaChartData: { amount: number; currency: string; date: string }[]
  averageChange: string
  barChartData: {
    amount: number
    category: string
    currency: string
    fill: string
  }[]
  countChange: string
  currency: string
  currentAverage: number
  currentCount: number
  currentTopCategory: string
  currentTopCategoryTotal: number
  currentTotal: number
  topCategoryChange: string
  totalExpensesChange: string
}

export function useExpenses(expenses: Expense[]): UseExpensesResult {
  const [range] = useQueryState<RangeKey>('range', {
    defaultValue: DEFAULT_RANGE,
    parse: (value): RangeKey =>
      value in DATE_RANGES ? (value as RangeKey) : DEFAULT_RANGE
  })

  const [selectedCategories] = useQueryState<string[]>('categories', {
    defaultValue: [],
    parse: (value: string) => (value ? value.split('+') : []),
    serialize: (value: string[]) => (value.length > 0 ? value.join('+') : '')
  })

  const selectedCategoriesSet = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories]
  )

  const [selectedCurrency] = useQueryState('currency', {
    defaultValue: 'USD',
    parse: (value): string => (value in currencyPatterns ? value : 'USD')
  })

  const [amountRange] = useQueryState('amount_range', {
    defaultValue: expenses?.length ? '0-Infinity' : '0-0'
  })

  const [minAmount, maxAmount] = useMemo(() => {
    const [min, max] = amountRange.split('-').map(Number)
    return [min, max === Infinity ? Number.MAX_SAFE_INTEGER : max]
  }, [amountRange])

  return useMemo(() => {
    if (!expenses.length) {
      return {
        areaChartData: [],
        averageChange: '0.0%',
        barChartData: [],
        countChange: '0.0%',
        currency: selectedCurrency,
        currentAverage: 0,
        currentCount: 0,
        currentTopCategory: 'N/A',
        currentTopCategoryTotal: 0,
        currentTotal: 0,
        topCategoryChange: '0.0%',
        totalExpensesChange: '0.0%'
      }
    }

    const { currentEnd, currentStart, previousEnd, previousStart } =
      getPeriodDates(range)

    let currentTotal = 0
    let currentCount = 0
    const currentCategoryTotals: Record<string, number> = {}
    const currentDateTotals: Record<string, number> = {}

    let previousTotal = 0
    let previousCount = 0
    const previousCategoryTotals: Record<string, number> = {}

    for (const expense of expenses) {
      if ((expense.currency || 'USD') !== selectedCurrency) continue
      if (expense.amount < minAmount || expense.amount > maxAmount) continue
      if (
        selectedCategoriesSet.size > 0 &&
        !selectedCategoriesSet.has(expense.category)
      )
        continue

      const expenseDate = dayjs(expense.date)

      // Current period
      if (expenseDate.isBetween(currentStart, currentEnd, null, '[]')) {
        currentTotal += expense.amount
        currentCount++
        currentCategoryTotals[expense.category] =
          (currentCategoryTotals[expense.category] || 0) + expense.amount

        const dateKey = expenseDate.format('YYYY-MM-DD')
        currentDateTotals[dateKey] =
          (currentDateTotals[dateKey] || 0) + expense.amount
      }

      // Previous period
      if (expenseDate.isBetween(previousStart, previousEnd, null, '[]')) {
        previousTotal += expense.amount
        previousCount++
        previousCategoryTotals[expense.category] =
          (previousCategoryTotals[expense.category] || 0) + expense.amount
      }
    }

    const currentAverage = currentCount > 0 ? currentTotal / currentCount : 0

    const previousAverage =
      previousCount > 0 ? previousTotal / previousCount : 0

    const sortedCurrentCategories = Object.entries(currentCategoryTotals).sort(
      ([, amountA], [, amountB]) => amountB - amountA
    )

    const [[currentTopCategory, currentTopCategoryTotal] = ['N/A', 0]] =
      sortedCurrentCategories

    const previousTopCategoryTotal =
      previousCategoryTotals[currentTopCategory] || 0

    // Percentage Changes
    const totalExpensesChange = getPercentageChange(currentTotal, previousTotal)
    const countChange = getPercentageChange(currentCount, previousCount)
    const averageChange = getPercentageChange(currentAverage, previousAverage)
    const topCategoryChange = getPercentageChange(
      currentTopCategoryTotal,
      previousTopCategoryTotal
    )

    // Prepare Chart Data
    const areaChartData = Object.entries(currentDateTotals)
      .map(([date, amount]) => ({
        amount: Number(amount.toFixed(2)),
        currency: selectedCurrency,
        date
      }))
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())

    const barChartData = sortedCurrentCategories
      .slice(0, 5)
      .map(([category, amount], index) => ({
        amount: Number(amount.toFixed(2)),
        category,
        currency: selectedCurrency,
        fill: `var(--chart-${index + 1})`
      }))

    return {
      areaChartData,
      averageChange,
      barChartData,
      countChange,
      currency: selectedCurrency,
      currentAverage,
      currentCount,
      currentTopCategory,
      currentTopCategoryTotal,
      currentTotal,
      topCategoryChange,
      totalExpensesChange
    }
  }, [
    expenses,
    range,
    minAmount,
    maxAmount,
    selectedCurrency,
    selectedCategoriesSet
  ])
}

// --- Helper: Calculate Percentage Change ---
function getPercentageChange(current: number, previous: number): string {
  if (previous === 0) {
    if (current === 0) {
      return '0.0%'
    }
    return '+100.0%'
  }
  if (current === 0) {
    return '-100.0%'
  }
  const change = ((current - previous) / previous) * 100
  const sign = Math.sign(change) >= 0 ? '+' : '-'
  return `${sign}${Math.abs(change).toFixed(1)}%`
}

const RANGE_DAYS: Record<RangeKey, number> = Object.fromEntries(
  Object.entries(DATE_RANGES).map(([key, { days }]) => [key, days])
) as Record<RangeKey, number>

// --- Helper: Get Date Ranges for Current and Previous Periods ---
function getPeriodDates(rangeKey: RangeKey): {
  currentEnd: dayjs.Dayjs
  currentStart: dayjs.Dayjs
  previousEnd: dayjs.Dayjs
  previousStart: dayjs.Dayjs
} {
  const daysToSubtract = RANGE_DAYS[rangeKey]
  const isToday = rangeKey === '0'

  const currentEnd = dayjs().endOf('day')

  const currentStart = isToday
    ? dayjs().startOf('day')
    : currentEnd.subtract(daysToSubtract - 1, 'day').startOf('day')

  const previousEnd = currentStart.subtract(1, 'millisecond')

  const previousStart = isToday
    ? previousEnd.startOf('day')
    : previousEnd.subtract(daysToSubtract - 1, 'day').startOf('day')

  return { currentEnd, currentStart, previousEnd, previousStart }
}
