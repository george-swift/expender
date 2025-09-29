import Link from 'next/link'
import { ReceiptTextIcon } from 'lucide-react'

import { footerItems } from '@/lib/site-metadata'

export function SiteFooter() {
  return (
    <footer className="px-2 pt-20 pb-2 lg:pt-40">
      <div className="w-full rounded-3xl bg-grey-3-light text-foreground-light px-6 pt-10 pb-8 lg:px-8 lg:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 xl:gap-20">
          <div className="grid items-center gap-8 pb-10 md:grid-cols-[2fr_1fr]">
            <div className="text-balance text-4xl font-medium lg:text-[40px]/[42px] xl:text-[48px]/[50px]">
              Join lots of other users who trust Expender.
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/sign-up"
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-foreground-light px-3.5 text-[15px]/[21px] font-medium text-background-light"
              >
                <ReceiptTextIcon className="size-4" />
                Try Expender today
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 xl:gap-10">
            <div className="md:grid md:grid-cols-2 md:gap-8 xl:gap-10">
              <FooterColumn title="Product" items={footerItems.product} />
              <FooterColumn
                title="Support"
                items={footerItems.support}
                className="mt-10 md:mt-0"
              />
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8 xl:gap-10">
              <FooterColumn title="Resources" items={footerItems.resources} />
              <FooterColumn
                title="Legal"
                items={footerItems.legal}
                className="mt-10 md:mt-0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-lg/[26px]">
              <ReceiptTextIcon className="size-5" />
              Expender
            </div>
            <div className="flex gap-x-6">
              {footerItems.social.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-grey-1 transition hover:text-foreground-light"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  items,
  className
}: {
  title: string
  items: readonly { name: string; href: string }[]
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="text-base/[22px] font-medium">{title}</h3>
      <ul role="list" className="mt-6 space-y-4 min-h-37.5">
        {items.map(item => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="text-base/[22px] text-grey-1 hover:text-foreground-light"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
