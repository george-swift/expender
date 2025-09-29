import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/marketing/site-footer'
import { SiteHeader } from '@/components/marketing/site-header'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pt-40 text-foreground-light">{children}</main>
      <SiteFooter />
    </div>
  )
}
