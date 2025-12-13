'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRightIcon, MenuIcon, ReceiptTextIcon, XIcon } from 'lucide-react'

import { marketingNav } from '@/lib/site-metadata'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const Icon = open ? XIcon : MenuIcon

  return (
    <header className="fixed left-1/2 top-6 z-40 -translate-x-1/2 flex min-h-[52px] items-center gap-3 rounded-xl bg-foreground-light pl-2 py-1.5 text-background-light backdrop-blur max-lg:w-70">
      <Link
        href="/"
        className="flex size-9 items-center justify-center rounded-lg bg-brand text-foreground-light"
        aria-label="Expender home"
      >
        <ReceiptTextIcon className="size-5 stroke-2" />
      </Link>

      <nav className="hidden lg:flex">
        {marketingNav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-10 items-center justify-center rounded-lg px-3 text-[15px]/[21px] font-medium transition ease-out',
                active ? 'bg-background/20' : 'hover:bg-background/10'
              )}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2 lg:pr-1.5">
        <Link
          href="/sign-up"
          className="h-10 shrink-0 group flex items-center justify-center rounded-lg bg-background-light px-3.5 text-[15px]/[21px] font-medium text-foreground-light"
        >
          <div className="min-w-22 h-6 relative overflow-hidden">
            <span className="flex gap-2.5 items-center absolute inset-0 justify-center ease-out transition-transform duration-150 group-hover:-translate-y-full">
              Start for free
            </span>
            <span className="flex gap-2.5 items-center absolute inset-0 justify-center translate-y-full ease-out transition-transform duration-150 group-hover:translate-y-0">
              Start for free
            </span>
          </div>
        </Link>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="pr-1.5 lg:hidden">
            <Button size="icon" variant="ghost" aria-label="Toggle navigation">
              <Icon className="size-6 stroke-[1.5]" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            sideOffset={12}
            align="end"
            className="grid w-[280px] rounded-2xl bg-foreground-light p-2 text-background-light"
          >
            {marketingNav.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex h-10 items-center justify-center rounded-md px-3 text-[15px]/[21px] font-medium',
                    active && 'bg-background-light/15'
                  )}
                >
                  {item.title}
                </Link>
              )
            })}

            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'secondary' }),
                'mt-1 h-9 justify-center gap-1'
              )}
            >
              Sign in <ArrowRightIcon className="size-4" />
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
