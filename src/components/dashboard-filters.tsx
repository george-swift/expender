'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { ListFilterPlusIcon, ListRestartIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { cn } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { useScroll } from '@/hooks/use-scroll'
import { FilterAmount } from '@/components/filter-amount'
import { FilterCategories } from '@/components/filter-categories'
import { FilterCurrency } from '@/components/filter-currency'
import { FilterDate } from '@/components/filter-date'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export function DashboardFilters({ expenses }: { expenses: Expense[] }) {
  const scrolled = useScroll(10)

  const [, setRange] = useQueryState('range')
  const [, setCategories] = useQueryState('categories')
  const [, setCurrency] = useQueryState('currency')
  const [, setAmountRange] = useQueryState('amount_range')

  const handleResetFilters = () => {
    setRange(null)
    setCategories(null)
    setCurrency(null)
    setAmountRange(null)
  }

  const [lastRefresh, setLastRefresh] = useState(() =>
    dayjs().format('DD/MM/YYYY HH:mm')
  )

  useEffect(() => {
    setLastRefresh(dayjs().format('DD/MM/YYYY HH:mm'))
  }, [expenses])

  return (
    <div
      className={cn(
        'sticky top-10 bg-background z-40 -my-2 flex transition-all flex-col gap-6 pt-10 pb-6 px-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:top-0 lg:px-6',
        { 'border-b': scrolled }
      )}
      aria-label="Dashboard filters"
    >
      <p className="whitespace-nowrap text-sm text-muted-foreground">
        Last refresh: {lastRefresh}
      </p>

      <Accordion className="block lg:hidden" collapsible type="single">
        <AccordionItem
          className="rounded-md border last:border-b"
          value="filters"
        >
          <AccordionTrigger className="px-4 py-2.5">Filters</AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <FilterDate />
              <FilterCategories />
              {expenses.length > 2 && <FilterAmount expenses={expenses} />}
              <FilterCurrency />
              <Button
                onClick={handleResetFilters}
                variant="secondary"
                aria-label="Reset filters"
              >
                <ListRestartIcon />
                Reset
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="hidden items-center gap-3 lg:flex lg:flex-wrap">
        <ListFilterPlusIcon className="size-4" />
        <FilterDate />
        <FilterCategories />
        {expenses.length > 2 && <FilterAmount expenses={expenses} />}
        <FilterCurrency />
        <Button
          onClick={handleResetFilters}
          variant="secondary"
          aria-label="Reset filters"
        >
          <ListRestartIcon />
          Reset
        </Button>
      </div>
    </div>
  )
}
