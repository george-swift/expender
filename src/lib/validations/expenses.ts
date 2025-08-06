import { z } from 'zod'

import { currencyPatterns } from '../utils'

const [currencyCode, ...otherCurrencyCodes] = Object.keys(currencyPatterns)

export const expenseSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Amount is required.' })
    .min(0, { message: 'Enter an amount greater than zero' }),
  category: z.string().min(1, { message: 'Select a category.' }),
  createdAt: z.coerce.string().optional(),
  currency: z.enum([currencyCode, ...otherCurrencyCodes]),
  date: z.coerce.string({
    required_error: 'A date the expense was incurred is required.'
  }),
  description: z
    .string()
    .max(140, { message: 'Description should be no more than 140 characters' })
    .optional(),
  expenseId: z.string().optional(),
  merchant: z
    .string()
    .min(1, { message: 'Merchant name is required.' })
    .max(70, {
      message: 'Limited to 70 characters. Add a description for more context.'
    }),
  receipt: z
    .object({
      name: z.string(),
      size: z.number(),
      url: z.string().url()
    })
    .nullable(),
  scanId: z.string().optional(),
  updatedAt: z.coerce.date().optional()
})

export type Expense = z.infer<typeof expenseSchema>

export const expensesSchema = z.object({
  expenses: z
    .array(expenseSchema)
    .min(1, { message: 'At least one expense must be provided' })
    .max(25, { message: 'No more than 25 expenses can be created at once' })
})

export type Expenses = z.infer<typeof expensesSchema>
