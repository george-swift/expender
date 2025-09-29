import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { categories, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

const expenseCategories = [
  { label: 'All Categories', value: 'all' },
  ...categories.map(category => ({ label: category, value: category }))
]

export function FilterCategories() {
  const [selectedCategories, setSelectedCategories] = useQueryState<string[]>(
    'categories',
    {
      defaultValue: ['all'],
      parse: (value: string) => (value ? value.split('+') : []),
      serialize: (value: string[]) => (value.length > 0 ? value.join('+') : '')
    }
  )

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelect = async (categoryValue: string) => {
    setSelectedCategories(prev => {
      const set = new Set(prev)
      if (categoryValue === 'all') {
        return null
      }
      if (set.has(categoryValue)) {
        set.delete(categoryValue)
      } else {
        set.delete('all')
        set.add(categoryValue)
      }
      return set.size > 0 ? Array.from(set) : null
    })
  }

  const selectedCategoriesSet = new Set(selectedCategories)

  const getButtonLabel = () => {
    const count = selectedCategoriesSet.size
    if (count === 0 || selectedCategoriesSet.has('all')) {
      return 'All Categories'
    }
    if (count === 1) {
      return selectedCategories[0]
    }
    return `${count} categories selected`
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild className="w-full lg:w-56">
        <Button
          aria-expanded={open}
          className={cn('rounded-lg justify-between shadow-none font-normal', {
            'text-muted-foreground': selectedCategories.length === 0
          })}
          role="combobox"
          variant="outline"
        >
          {getButtonLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))] sm:min-w-56 sm:max-w-56 p-0"
      >
        <Command>
          <CommandInput
            className="h-9"
            onValueChange={setSearchTerm}
            placeholder="Search category..."
            value={searchTerm}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {expenseCategories.map(category => (
                <CommandItem
                  key={category.value}
                  onSelect={handleSelect}
                  value={category.value}
                >
                  {category.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedCategoriesSet.has(category.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
