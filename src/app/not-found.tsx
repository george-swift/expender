import Link from 'next/link'

import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/marketing/site-header'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-7xl mx-auto px-4 lg:px-6 lg:pt-40">
        <div className="space-y-5 w-75 text-center text-balance">
          <div className="text-[32px]/[38px] font-medium">
            Oops! This page was not found.
          </div>
          <div className="text-sm text-muted-foreground">
            You may have mistyped the address or the page may have moved.
          </div>
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-11 bg-brand font-normal'
          )}
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
