'use client'

import { useMemo } from 'react'
import dayjs from 'dayjs'
import {
  HashIcon,
  InfoIcon,
  LucideIcon,
  SquareSplitHorizontalIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
  WalletIcon
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis
} from 'recharts'

import { cn, formatters } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { useExpenses } from '@/hooks/use-expenses'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

export function DashboardCharts({ expenses }: { expenses: Expense[] }) {
  const data = useExpenses(expenses)

  const areaChartConfig = useMemo(
    (): ChartConfig => ({
      amount: { color: 'var(--chart-1)', label: 'Amount' }
    }),
    []
  )

  const barChartConfig = useMemo((): ChartConfig => {
    const config: ChartConfig = {
      amount: { color: 'var(--background)', label: 'Amount' }
    }

    data.barChartData.forEach(item => {
      config[item.category] = { label: item.category }
    })
    return config
  }, [data.barChartData])

  const trends = [
    {
      icon: WalletIcon,
      label: 'Total Expenses',
      value: data.currentTotal,
      percentage: data.totalExpensesChange,
      currency: data.currency,
      formatValue: true
    },
    {
      icon: SquareSplitHorizontalIcon,
      label: 'Average Expense',
      value: data.currentAverage,
      percentage: data.averageChange,
      currency: data.currency,
      formatValue: true
    },
    {
      icon: HashIcon,
      label: 'No. of Expenses',
      value: data.currentCount,
      percentage: data.countChange
    },
    {
      icon: TrophyIcon,
      label: 'Top Category',
      value: data.currentTopCategoryTotal,
      percentage: data.topCategoryChange,
      currency: data.currency,
      formatValue: true,
      tooltip:
        data.currentTopCategory !== 'N/A' ? data.currentTopCategory : undefined
    }
  ] as const

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 dark:*:data-[slot=card]:bg-card lg:px-6">
        {trends.map(trend => (
          <DashboardTrend key={trend.label} {...trend} />
        ))}
      </div>

      <div className="px-4 pb-10 space-y-4 lg:px-6">
        <Card className="@container/card shadow-none">
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
            <CardDescription>
              Showing changes in your expenses over time, based on the filters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenses?.length ? (
              <ChartContainer
                className="aspect-auto h-[300px] w-full"
                config={areaChartConfig}
              >
                <AreaChart data={data.areaChartData}>
                  <defs>
                    <linearGradient id="fillAmount" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-amount)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-amount)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    tickFormatter={value =>
                      dayjs(value as string).format('DD-MM-YY')
                    }
                    tickLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={props => (
                      <ChartTooltipContent
                        {...props}
                        indicator="line"
                        valueFormatter={value =>
                          formatters.currency({
                            currency: data.currency,
                            maximumFractionDigits: 2,
                            number: Number(value)
                          })
                        }
                      />
                    )}
                    cursor={false}
                  />
                  <Area
                    dataKey="amount"
                    fill="var(--color-amount)"
                    fillOpacity={0.4}
                    stackId="a"
                    stroke="var(--color-amount)"
                    type="natural"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="@container/card shadow-none">
          <CardHeader className="relative">
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>
              Distribution of your highest expenses by category, based on the
              filters.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {expenses?.length ? (
              <ChartContainer
                className="aspect-auto h-[300px] w-full"
                config={barChartConfig}
              >
                <BarChart
                  accessibilityLayer
                  data={data.barChartData}
                  layout="vertical"
                >
                  <XAxis
                    axisLine={false}
                    dataKey="amount"
                    minTickGap={32}
                    tickFormatter={value =>
                      formatters.currency({
                        currency: data.currency,
                        maximumFractionDigits: 2,
                        number: Number(value)
                      })
                    }
                    tickLine={false}
                    tickMargin={8}
                    type="number"
                  />
                  <YAxis
                    axisLine={false}
                    dataKey="category"
                    hide
                    tickLine={false}
                    tickMargin={8}
                    type="category"
                  />
                  <ChartTooltip
                    content={props => (
                      <ChartTooltipContent
                        {...props}
                        indicator="line"
                        labelClassName="min-w-24"
                        valueFormatter={value =>
                          formatters.currency({
                            currency: data.currency,
                            number: Number(value)
                          })
                        }
                      />
                    )}
                    cursor={false}
                  />
                  <Bar dataKey="amount" radius={5}>
                    <LabelList
                      className="fill-[var(--color-amount)]"
                      dataKey="category"
                      fontSize={12}
                      offset={8}
                      position="insideLeft"
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface DashboardTrendProps {
  currency?: string
  formatValue?: boolean
  icon: LucideIcon
  label: string
  percentage: string
  tooltip?: string
  value: number | string
}

export function DashboardTrend({
  currency,
  formatValue,
  icon: Icon,
  label,
  percentage,
  tooltip,
  value
}: DashboardTrendProps) {
  const isPositive = percentage.startsWith('+')
  const isNegative = percentage.startsWith('-')

  const formattedValue = formatValue
    ? formatters.currency({ currency, number: value as number })
    : value

  return (
    <Card className="@container/card shadow-none py-4">
      <CardHeader className="relative px-4 gap-2">
        <CardTitle
          className={cn('@[250px]/card:text-3xl text-2xl font-medium order-1', {
            '@[250px]/card:text-2xl': String(formattedValue).length > 15
          })}
        >
          {formattedValue}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 order-0">
          <span className="size-5 flex items-center justify-center rounded-md border">
            <Icon className="size-3" />
          </span>
          <span>{label}</span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="top">{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </CardDescription>
        <div className="absolute right-4 top-0">
          <Badge
            className={cn('flex gap-1 rounded-xl text-xs text-foreground', {
              'text-destructive-foreground': isNegative,
              'text-green-600': isPositive
            })}
            variant="outline"
          >
            {isPositive && <TrendingUpIcon className="size-3" />}
            {isNegative && <TrendingDownIcon className="size-3" />}
            {percentage}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}
