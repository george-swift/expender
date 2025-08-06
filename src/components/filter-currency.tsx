import { useQueryState } from 'nuqs'

import { currencyPatterns } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function FilterCurrency() {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'USD',
    parse: (value): string => (value in currencyPatterns ? value : 'USD')
  })

  return (
    <Select onValueChange={setCurrency} value={currency}>
      <SelectTrigger className="w-full lg:w-24" id="currency-select">
        <SelectValue placeholder="Select date" />
      </SelectTrigger>
      <SelectContent className="min-w-24">
        <ScrollArea className="h-80">
          {Object.keys(currencyPatterns).map(currencyCode => (
            <SelectItem key={currencyCode} value={currencyCode}>
              {currencyCode}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  )
}
