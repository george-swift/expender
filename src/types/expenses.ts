type CurrencyFormatter = (args: CurrencyFormatterArgs) => string

interface CurrencyFormatterArgs {
  currency?: string
  maximumFractionDigits?: number
  number: number
}

type FileSizeFormatter = (size: number) => string

interface MillionFormatterArgs {
  decimals?: number
  number: number
}

type MillionFormatter = (args: MillionFormatterArgs) => string

interface PercentageFormatterArgs {
  decimals?: number
  number: number
}

type PercentageFormatter = (args: PercentageFormatterArgs) => string

type UnitFormatter = (number: number) => string

export interface Formatters {
  currency: CurrencyFormatter
  fileSize: FileSizeFormatter
  million: MillionFormatter
  percentage: PercentageFormatter
  unit: UnitFormatter
}

export type ExportFormat = 'csv' // Only CSV supported in MMP

export interface PresignedS3PostURLResponse {
  url: string
  formData: FormData
  formUrl: string
}
