import { useQueryState } from 'nuqs'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const DATE_RANGES = {
  '0': { days: 0, label: 'Today' },
  '7': { days: 7, label: 'Last 7 Days' },
  '30': { days: 30, label: 'Last 1 month' },
  '60': { days: 60, label: 'Last 2 months' },
  '90': { days: 90, label: 'Last 3 months' },
  '180': { days: 180, label: 'Last 6 months' },
  '365': { days: 365, label: 'Last 1 year' }
} as const

export type RangeKey = keyof typeof DATE_RANGES
export const DEFAULT_RANGE: RangeKey = '7'

export function FilterDate() {
  const [range, setRange] = useQueryState<RangeKey>('range', {
    defaultValue: DEFAULT_RANGE,
    parse: (value): RangeKey =>
      value in DATE_RANGES ? (value as RangeKey) : DEFAULT_RANGE
  })

  return (
    <Select onValueChange={value => setRange(value as RangeKey)} value={range}>
      <SelectTrigger
        className="w-full rounded-lg shadow-none lg:w-36"
        aria-label="Date range"
      >
        <SelectValue placeholder="Select date" />
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(DATE_RANGES).map(([key, { label }]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
