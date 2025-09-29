'use client'

import Image from 'next/image'
import Link from 'next/link'
import DashboardImg from '@/public/images/expender-dashboard.png'
import {
  ArrowRightIcon,
  ChevronRightIcon,
  PlayIcon,
  StarIcon
} from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button, buttonVariants } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6">
      <div className="grid gap-8 pb-20 md:grid-cols-[2fr_1fr] lg:pb-30">
        <div className="grid gap-6">
          <Link
            href="#"
            className="group w-fit bg-background-light flex items-center text-sm/5.25 font-medium rounded-[50px] gap-2 py-1 pl-4 pr-2.5"
          >
            <span>Announcing the Beta Release</span>
            <ChevronRightIcon className="size-3.5 stroke-2 transition-transform ease-in-out group-hover:translate-x-1" />
          </Link>

          <h1 className="max-w-2xl text-5xl font-medium lg:text-6xl">
            Change the way you treat your expenses
          </h1>

          <p className="text-grey-1 max-w-[472px]">
            Smart expense tracking that saves time and reveals insights that
            matter. Everything you need to make informed financial decisions.
          </p>

          <a
            href="https://www.g2.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 text-sm/5.25 font-medium group"
          >
            <div className="flex items-center gap-x-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  className="size-3 fill-current text-current"
                />
              ))}
            </div>
            <div className="flex items-center gap-x-1.5">
              <span>4.9 rating</span>
              <ChevronRightIcon className="size-3.5 stroke-2 transition-transform ease-in-out group-hover:translate-x-1" />
            </div>
          </a>
        </div>
        <div className="h-full flex items-end gap-2">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ size: 'lg', className: 'h-12' }),
              'bg-foreground-light hover:bg-foreground-light/90 text-background-light rounded-lg'
            )}
          >
            Sign In
            <ArrowRightIcon className="size-4" />
          </Link>

          <Button
            size="lg"
            variant="ghost"
            className="h-12 text-base/[22px] rounded-lg cursor-pointer hover:bg-grey-3-light"
            onClick={() =>
              toast('Video coming soon!', {
                description:
                  "We're working on it and will have it ready shortly."
              })
            }
          >
            <PlayIcon className="size-4 fill-foreground-light" />
            See Expender in action
          </Button>
        </div>
      </div>

      <AspectRatio
        ratio={16 / 10}
        className="overflow-hidden rounded-3xl max-h-[733px] bg-brand p-4 lg:p-6 xl:p-12"
      >
        <Image
          src={DashboardImg}
          alt="Placeholder"
          placeholder="blur"
          className="object-contain rounded-xl xl:rounded-2xl"
          priority
        />
      </AspectRatio>
    </section>
  )
}
