import Link from 'next/link'
import { ArrowRightIcon, ReceiptTextIcon } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="max-w-7xl mx-auto pt-20 lg:pt-40 max-lg:px-4">
      <div className="flex flex-col items-center justify-center w-full min-h-75 space-y-8 py-10 px-6 rounded-4xl bg-foreground-light text-background-light lg:px-8 lg:py-20 lg:min-h-100">
        <div className="space-y-8 lg:space-y-10">
          <div className="flex items-center justify-center *:rounded-[10px]">
            <div className="size-7 bg-brand flex items-center justify-center">
              <ReceiptTextIcon className="size-4 stroke-2 text-foreground-light" />
            </div>
            <div className="h-7 bg-background-light/10 px-2.5 flex items-center justify-center text-sm/4.5">
              Try Expender
            </div>
          </div>

          <h2 className="text-center text-balance text-4xl font-medium lg:text-[40px]/[42px] xl:text-[48px]/[50px] lg:max-w-[542px]">
            Take control of your expenses today
          </h2>
        </div>

        <Link
          href="/sign-up"
          className="group h-12 rounded-lg bg-brand text-foreground-light font-medium text-[15px]/[21px] px-3.5 flex flex-col items-center justify-center gap-2"
        >
          <div className="min-w-42 h-6 relative overflow-hidden">
            <span className="flex gap-2.5 items-center absolute inset-0 justify-center ease-out transition-transform duration-150 group-hover:-translate-y-full">
              Try Expender for free
              <ArrowRightIcon className="size-4" />
            </span>
            <span className="flex gap-2.5 items-center absolute inset-0 justify-center translate-y-full ease-out transition-transform duration-150 group-hover:translate-y-0">
              Try Expender for free
              <ArrowRightIcon className="size-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
