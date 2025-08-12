'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ReceiptTextIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useIsomorphicHeader } from '@/hooks/use-isomorphic-header'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { Container } from '@/components/container'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

const navigation = [
  { href: '#use-cases', title: 'Use cases' },
  { href: '#how-it-works', title: 'How it works' },
  { href: '#faqs', title: 'FAQs' }
]

const MobileNavigation = () => {
  const [open, setOpen] = useState(false)
  const { scrollToElement } = useSmoothScroll()

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setOpen(false)
      scrollToElement(href)
    }
  }

  return (
    <div className="flex items-center justify-between pointer-events-auto lg:hidden">
      <Link className="flex items-center gap-1.5 font-semibold" href="/">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground dark:bg-background">
          <ReceiptTextIcon className="size-4" />
        </div>
      </Link>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Menu
            <ChevronDownIcon className="ml-1 size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="top-40">
          <DialogHeader className="text-left">
            <DialogTitle className="text-sm">Navigation</DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col">
            {navigation.map(({ href, title }) => (
              <li key={title}>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start'
                  )}
                  href={href}
                  onClick={handleNavClick(href)}
                >
                  {title}
                </Link>
              </li>
            ))}
            <Separator />
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'w-full justify-start'
              )}
              href="/sign-in"
              onClickCapture={() => setOpen(false)}
            >
              Log in
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'w-full justify-start'
              )}
              href="/sign-up"
              onClickCapture={() => setOpen(false)}
            >
              Sign up
            </Link>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const DesktopNavigation = (props: React.ComponentPropsWithoutRef<'nav'>) => {
  const { scrollToElement } = useSmoothScroll()

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      scrollToElement(href)
    }
  }

  return (
    <nav {...props}>
      <ul
        className={cn(
          'h-14 flex rounded-xl px-3 text-sm font-medium backdrop-blur transition-colors duration-200 ease-linear *:flex *:items-center',
          'bg-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/30 dark:ring-white/10',
          'header-top:bg-transparent header-top:shadow-none header-top:ring-0 header-top:dark:text-white'
        )}
      >
        <li className="grow">
          <Link className="flex items-center gap-1.5 font-semibold" href="/">
            <ReceiptTextIcon className="size-4" />
            <div className="leading-tight text-base">Expender</div>
          </Link>
        </li>
        {navigation.map(({ href, title }, index) => (
          <li className={cn('group mx-2', { 'ml-12': !index })} key={title}>
            <Link
              className="relative block px-3 py-2 underline-offset-4 transition group-hover:underline cursor-pointer"
              onClick={handleNavClick(href)}
              href={href}
            >
              {title}
            </Link>
          </li>
        ))}
        <li className="grow justify-end gap-3">
          <Link
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'font-semibold'
            )}
            href="/sign-in"
          >
            Log in
          </Link>
          <Link
            className={cn(buttonVariants(), 'font-semibold')}
            href="/sign-up"
          >
            Sign up
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export function Header() {
  const { headerRef } = useIsomorphicHeader()

  return (
    <>
      <header
        className="pointer-events-none relative z-50"
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)'
        }}
      >
        <div
          className="top-0 z-10 h-16 pt-6"
          ref={headerRef}
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position']
          }}
        >
          <Container
            className="relative max-w-none"
            wrapperClasses="top-[var(--header-top,theme(spacing.6))] w-full"
          >
            <MobileNavigation />
            <DesktopNavigation className="pointer-events-auto hidden lg:block" />
          </Container>
        </div>
      </header>
      <div className="flex-none" style={{ height: 'var(--content-offset)' }} />
    </>
  )
}
