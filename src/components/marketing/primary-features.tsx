'use client'

import Image from 'next/image'
import {
  ArrowLeftRightIcon,
  ArrowLeftToLineIcon,
  FingerprintIcon,
  HashIcon,
  HeadsetIcon,
  HomeIcon,
  NewspaperIcon,
  PencilIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
  ScanTextIcon,
  SettingsIcon,
  SparklesIcon,
  SquareSplitHorizontalIcon,
  Trash2Icon,
  TrendingUpIcon,
  WalletIcon
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { formatters } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { PasskeyIcon } from '@/components/ui/icons'
import { Separator } from '@/components/ui/separator'

export function PrimaryFeatures() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 text-center text-foreground-light pt-20 max-w-7xl mx-auto px-4 lg:px-6 lg:pt-40">
      <div className="flex items-center *:rounded-[10px]">
        <div className="size-7 bg-brand flex items-center justify-center">
          <ReceiptTextIcon className="size-4 stroke-2 text-foreground-light" />
        </div>
        <div className="h-7 bg-background-light px-2.5 flex items-center justify-center text-sm/4.5">
          Meet Expender
        </div>
      </div>

      <h2 className="text-4xl font-medium lg:text-[40px]/[42px] lg:w-1/2">
        See where your money goes, control where it flows
      </h2>

      <div className="mt-5 w-full grid grid-rows-[repeat(2,min-content)] text-left gap-4 *:min-h-100 md:grid-cols-2 xl:grid-cols-3">
        <div className="px-8 pb-8 pt-12 space-y-10 rounded-3xl bg-grey-3-light/50 xl:px-10 xl:pb-10 xl:pt-14">
          <div className="space-y-4">
            <p className="text-[23px]/[30px] tracking-[-0.23px] font-medium text-balance xl:text-[28px]/[36px]">
              Snap, scan, and save time instantly
            </p>
            <p className="text-grey-1 leading-[22px]">
              Snap any receipt and Expender instantly pulls the key data so you
              don&apos;t have to.
            </p>
          </div>

          <div className="grid gap-4 p-4 rounded-xl bg-background-light">
            <div className="flex gap-2 items-center">
              <ScanTextIcon className="size-3" />
              <span className="text-base/[22px] font-medium">
                Receipt scanning
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 min-h-44 bg-grey-4/70 rounded-xl">
              <Image
                src="/images/receipt-illustration.svg"
                alt="Illustration of a receipt being scanned"
                width={150}
                height={150}
                className="size-16 grayscale"
              />
              <div className="w-3/4 text-balance text-center font-medium text-base/[22px] text-grey-1">
                Real-time data extraction in 3-5 seconds
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 pt-12 space-y-10 rounded-3xl bg-grey-3-light/50 xl:px-10 xl:pb-10 xl:pt-14">
          <div className="space-y-4">
            <p className="text-[23px]/[30px] tracking-[-0.23px] font-medium text-balance xl:text-[28px]/[36px]">
              Multi-currency expense management
            </p>
            <p className="text-grey-1 leading-[22px]">
              Support for 18+ global currencies for seamless expense tracking.
            </p>
          </div>

          <div className="px-4 py-3 rounded-xl divide-y divide-grey-3-light bg-background-light">
            {currencies.map(currency => (
              <div
                key={currency.code}
                className="h-11 flex items-center justify-between"
              >
                <p className="leading-[22px]">
                  {currency.flag} &nbsp;{currency.name}
                </p>

                <span className="px-1.5 min-w-10 font-medium text-center text-xs/6 text-grey-1 rounded-md border border-grey-3-light">
                  {currency.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8 pt-12 space-y-10 rounded-3xl bg-grey-3-light/50 md:col-span-full xl:col-auto xl:px-10 xl:pb-10 xl:pt-14">
          <div className="space-y-4">
            <p className="text-[23px]/[30px] tracking-[-0.23px] font-medium text-balance xl:text-[28px]/[36px]">
              Secure, passwordless authentication
            </p>
            <p className="text-grey-1 leading-[22px]">
              Sign in instantly with biometrics or security keys. Maximum
              security guaranteed.
            </p>
          </div>

          <div className="grid gap-3.5">
            <div className="py-2 w-fit px-4 text-base/[22px] font-medium bg-foreground-light text-background-light rounded-[52px]">
              Add a passkey
            </div>

            <div className="min-h-22 flex items-center justify-between gap-2 p-4 rounded-xl bg-background-light xl:p-3.25">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <PasskeyIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-grey-1"
                  />
                  <div className="flex flex-1 gap-2">
                    <span className="truncate text-base/[22px]">
                      Second Passkey
                    </span>
                    <Badge variant="outline" className="text-grey-1">
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="w-full flex items-center shrink-0 text-xs text-muted-foreground space-x-1.5">
                  <span>Added on May 4, 2025</span>
                  <Separator
                    className="max-sm:hidden data-[orientation=vertical]:h-3"
                    orientation="vertical"
                  />
                  <span>Last used 3 days ago</span>
                </div>
              </div>
              <div className="h-11 flex items-start shrink-0 space-x-2.5">
                <PencilIcon className="size-3.5" />
                <Trash2Icon className="size-3.5" />
              </div>
            </div>

            <div className="min-h-22 flex items-center justify-between gap-2 p-4 rounded-xl bg-background-light xl:p-3.25">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <FingerprintIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-grey-1"
                  />
                  <div className="flex flex-1 gap-2">
                    <span className="truncate text-base/[22px]">
                      Default Passkey
                    </span>
                    <Badge variant="outline" className="text-grey-1">
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="w-full flex items-center shrink-0 text-xs text-muted-foreground space-x-1.5">
                  <span>Added on May 2, 2025</span>
                  <Separator
                    className="max-sm:hidden data-[orientation=vertical]:h-3"
                    orientation="vertical"
                  />
                  <span>Last used 7 days ago</span>
                </div>
              </div>
              <div className="h-11 flex items-start shrink-0 space-x-2.5">
                <PencilIcon className="size-3.5" />
                <Trash2Icon className="size-3.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-140 col-span-full grid gap-8 pl-8 pt-12 rounded-3xl bg-grey-3-light/50 xl:pl-10 xl:pt-14 xl:grid-cols-[1fr_2fr] xl:gap-10">
          <div className="space-y-4">
            <p className="text-[23px]/[30px] tracking-[-0.23px] font-medium text-balance xl:text-[28px]/[36px]">
              Powerful analytics and financial insights
            </p>
            <p className="text-grey-1 leading-[22px] max-w-[330px]">
              Visualize spending patterns and export detailed reports to make
              informed decisions.
            </p>
          </div>

          <div className="size-full min-h-[511px] grid grid-cols-[1fr_3fr] gap-2.5 pl-2 pt-2 rounded-tl-3xl bg-grey-5/90">
            <div className="p-2 space-y-6">
              <div className="flex items-center justify-between">
                <ReceiptTextIcon className="size-5" />
                <ArrowLeftToLineIcon className="size-4 stroke-1" />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md bg-grey-3/40">
                    <HomeIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm">Dashboard</span>
                  </div>
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md">
                    <ArrowLeftRightIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm">Expenses</span>
                  </div>
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md">
                    <SparklesIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm">AI Suite</span>
                  </div>
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md">
                    <SettingsIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm">Settings</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md">
                    <RefreshCwIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm">Refresh</span>
                  </div>
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md">
                    <NewspaperIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm">Blog</span>
                  </div>
                  <div className="h-9.5 px-2.5 py-3 flex items-center gap-2 rounded-md">
                    <HeadsetIcon className="size-4 stroke-[1.5]" />
                    <span className="text-sm whitespace-nowrap">
                      Help Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5 rounded-tl-2xl bg-background-light overflow-x-hidden">
              <div className="h-13 flex items-center px-4 gap-1.5 text-grey-1 border-b border-grey-3-light">
                <HomeIcon className="size-3.5" />
                <span className="text-sm">Dashboard</span>
              </div>

              <div className="px-5 text-xl/6.5 font-medium">Overview</div>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-3 px-5 *:shrink-0 *:h-21 *:w-55">
                  <div className="px-4 pb-3 pt-4 space-y-2 rounded-xl border border-grey-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="size-5 flex items-center justify-center rounded-md bg-brand">
                          <WalletIcon className="size-3" />
                        </span>
                        <span className="text-muted-foreground">
                          Total Expenses
                        </span>
                      </div>

                      <Badge
                        variant="outline"
                        className="rounded-xl text-xs text-green-600"
                      >
                        <TrendingUpIcon className="size-3" />
                        5%
                      </Badge>
                    </div>
                    <div className="text-lg font-medium">$5,290.45</div>
                  </div>

                  <div className="px-4 pb-3 pt-4 space-y-2 rounded-xl border border-grey-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="size-5 flex items-center justify-center rounded-md border border-grey-3">
                          <SquareSplitHorizontalIcon className="size-3" />
                        </span>
                        <span className="text-muted-foreground">
                          Average Expense
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-medium">$90.45</div>
                  </div>

                  <div className="px-4 pb-3 pt-4 space-y-2 rounded-xl border border-grey-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="size-5 flex items-center justify-center rounded-md border border-grey-3">
                          <HashIcon className="size-3" />
                        </span>
                        <span className="text-muted-foreground">
                          No. of Expenses
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-medium">58</div>
                  </div>
                </div>

                <div className="grow min-h-64 ml-5 p-4 space-y-5 rounded-l-xl border-l border-y border-grey-3 overflow-hidden">
                  <div className="text-base/[22px] font-medium">Trends</div>
                  <ChartContainer
                    className="aspect-auto h-[300px] w-full"
                    config={chartConfig}
                  >
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{ left: 12, right: 12 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={value => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={props => (
                          <ChartTooltipContent
                            {...props}
                            indicator="line"
                            valueFormatter={value =>
                              formatters.currency({
                                currency: '$',
                                maximumFractionDigits: 0,
                                number: Number(value)
                              })
                            }
                          />
                        )}
                      />
                      <Area
                        dataKey="amount"
                        type="natural"
                        fill="var(--color-amount)"
                        fillOpacity={0.4}
                        stroke="var(--color-amount)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>

                <div className="grow ml-5 p-4 space-y-5 rounded-tl-xl border-l border-t border-grey-3">
                  <div className="text-base/[22px] font-medium">
                    Top Categories
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const currencies = [
  {
    name: 'US Dollar',
    code: 'USD',
    flag: '🇺🇸'
  },
  {
    name: 'Nigerian Naira',
    code: 'NGN',
    flag: '🇳🇬'
  },
  {
    name: 'Japanese Yen',
    code: 'JPY',
    flag: '🇯🇵'
  },
  {
    name: 'Indian Rupee',
    code: 'INR',
    flag: '🇮🇳'
  },
  {
    name: 'Australian Dollar',
    code: 'AUD',
    flag: '🇦🇺'
  }
]

const chartData = [
  { month: 'January', amount: 186 },
  { month: 'February', amount: 305 },
  { month: 'March', amount: 237 },
  { month: 'April', amount: 73 },
  { month: 'May', amount: 209 },
  { month: 'June', amount: 214 }
]

const chartConfig = {
  amount: { label: 'Amount', color: 'var(--chart-1)' }
} satisfies ChartConfig
