import Image from 'next/image'
import BudgetingImg from '@/public/images/budgeting.avif'
import { ReceiptTextIcon } from 'lucide-react'

import { secondaryFeatures } from '@/lib/site-metadata'

export function SecondaryFeatures() {
  return (
    <section className="flex flex-col gap-8 pt-20 max-w-7xl mx-auto px-4 lg:px-6 lg:pt-40">
      <div className="flex items-center *:rounded-[10px]">
        <div className="size-7 bg-brand flex items-center justify-center">
          <ReceiptTextIcon className="size-4 stroke-2 text-foreground-light" />
        </div>
        <div className="h-7 bg-background-light px-2.5 flex items-center justify-center text-sm/4.5">
          Features
        </div>
      </div>

      <h2 className="text-4xl font-medium text-balance lg:text-[40px]/[42px] lg:w-1/2">
        Designed to help you manage expenses efficiently
      </h2>

      <div className="mt-5 w-full grid gap-4 xl:grid-cols-2">
        <div className="grid gap-4 lg:grid-cols-2">
          {secondaryFeatures.map((feature, index) => (
            <div
              key={index}
              className="w-full h-45 flex flex-col justify-between rounded-3xl bg-background-light p-6 xl:h-[342px]"
            >
              <div className="size-7 flex items-center justify-center rounded-[10px] border border-grey-3-light">
                <feature.icon className="size-4.5 stroke-[1.5]" />
              </div>
              <div className="space-y-3 text-balance">
                <div className="text-lg/[23px] font-medium xl:text-xl/[26px]">
                  {feature.title}
                </div>
                <div className="text-sm text-grey-1">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-muted h-90 rounded-3xl lg:h-115 xl:h-full">
          <Image
            src={BudgetingImg}
            alt="Budgeting on iPad using GoodNotes"
            placeholder="blur"
            className="rounded-[inherit] object-cover size-[inherit]"
          />
        </div>
      </div>
    </section>
  )
}
