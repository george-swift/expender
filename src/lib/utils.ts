import { UserResource } from '@clerk/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Formatters } from '@/types/expenses'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isWebAuthnSupported(): boolean {
  return (
    globalThis &&
    'credentials' in navigator &&
    'PublicKeyCredential' in globalThis &&
    'isUserVerifyingPlatformAuthenticatorAvailable' in PublicKeyCredential
  )
}

// Supported expense categories
export const categories = [
  'Advertising',
  'Benefits',
  'Car',
  'Employee Salaries',
  'Equipment',
  'Fees',
  'Home Office',
  'Insurance',
  'Interest',
  'Internet',
  'Labor',
  'Maintenance',
  'Marketing',
  'Meals and Entertainment',
  'Office Supplies',
  'Other',
  'Phone',
  'Professional Services',
  'Rent',
  'Shipping and Delivery',
  'Shopping',
  'Subscriptions',
  'Taxes',
  'Technology and Software',
  'Training and Development',
  'Travel',
  'Utilities'
]

// Supported currencies (ISO 4217)
export const currencyPatterns = {
  AED: ['د.إ', 'AED'],
  ARS: ['$', 'ARS'],
  AUD: ['A$', 'AUD'],
  BRL: ['R$', 'BRL'],
  CAD: ['CA$', 'CAD'],
  CHF: ['CHF', 'Fr'],
  EUR: ['€', 'EUR'],
  GBP: ['£', 'GBP'],
  GHS: ['GH₵', 'GHS'],
  INR: ['₹', 'INR'],
  JPY: ['¥', 'JPY'],
  KES: ['KSh', 'KES'],
  MXN: ['MX$', 'MXN'],
  NGN: ['₦', 'NGN'],
  QAR: ['ر. ق', 'QAR'],
  TRY: ['₺', 'TRY'],
  USD: ['$', 'USD'],
  ZAR: ['R', 'ZAR']
}

// Supported file types for Smart Scan uploads
export const smartScanFileTypes = ['application/pdf', 'image/jpeg', 'image/png']

export const formatters: Formatters = {
  currency: ({
    currency = 'USD',
    maximumFractionDigits = 2,
    number
  }: {
    currency?: string
    maximumFractionDigits?: number
    number: number
  }) => {
    const [symbol] =
      currencyPatterns[currency as keyof typeof currencyPatterns] ??
      currencyPatterns.USD

    return symbol
      ? `${symbol}${new Intl.NumberFormat('en-US', {
          maximumFractionDigits,
          minimumFractionDigits: maximumFractionDigits,
          style: 'decimal'
        }).format(number)}`
      : new Intl.NumberFormat('en-US', {
          currency,
          maximumFractionDigits,
          style: 'currency'
        }).format(number)
  },

  fileSize: (size: number) => {
    const KB = 1024 // 1 KB i.e 1024 bytes
    const MB = KB * 1024 // 1 MB i.e 1024 KB

    if (size >= MB) {
      return `${(size / MB).toFixed(1)} MB`
    } else if (size >= KB) {
      return `${(size / KB).toFixed(1)} KB`
    }
    return `${size} bytes`
  },

  million: ({
    decimals = 1,
    number
  }: {
    decimals?: number
    number: number
  }) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      style: 'decimal'
    }).format(number)
    return `${formattedNumber}M`
  },

  percentage: ({
    decimals = 1,
    number
  }: {
    decimals?: number
    number: number
  }) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      style: 'percent'
    }).format(number)
    const symbol = number > 0 && number !== Infinity ? '+' : ''

    return `${symbol}${formattedNumber}`
  },

  unit: (number: number) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal'
    }).format(number)
    return formattedNumber
  }
}

export const getUserNameAndInitials = (
  user: UserResource | null | undefined
) => {
  if (!user) return { name: null, initials: null }

  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  const initials = (
    (name.split(' ')?.[0] || user.primaryEmailAddress?.emailAddress) ??
    ''
  )
    .slice(0, 2)
    .toUpperCase()
  return { name, initials }
}

export const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.max(minValue, Math.min(value, maxValue))
