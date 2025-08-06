'use client'

import { useLayoutEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

export function Screenshot({
  alt = '',
  className,
  height,
  src,
  srcDark,
  width
}: {
  alt?: string
  className?: string
  height: number
  src: string
  srcDark?: string
  width: number
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const imageSrc =
    mounted && resolvedTheme === 'dark' && srcDark ? srcDark : src

  return (
    <div
      className={cn(
        className,
        'relative aspect-[var(--width)/var(--height)] [--radius:.75rem]'
      )}
      style={{ '--height': height, '--width': width } as React.CSSProperties}
    >
      <div className="absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:theme(spacing.2)] dark:ring-white/10" />
      <Image
        alt={alt}
        className="!relative h-full rounded-[var(--radius)] shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        fill
        priority
        src={imageSrc}
      />
    </div>
  )
}

export function ScreenshotWithBottomGradient({
  alt = '',
  className,
  height,
  imgClassName,
  src,
  srcDark,
  width
}: {
  alt?: string
  className?: string
  height: number
  imgClassName?: string
  src: string
  srcDark?: string
  width: number
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const imageSrc =
    mounted && resolvedTheme === 'dark' && srcDark ? srcDark : src

  return (
    <div
      className={cn(
        className,
        'relative mx-auto max-w-6xl px-6 overflow-hidden lg:px-8'
      )}
    >
      <Image
        alt={alt}
        className={cn(
          'mb-[-12%] rounded-xl shadow-xl ring-1 ring-gray-900/10 dark:ring-white/10',
          imgClassName
        )}
        height={height}
        src={imageSrc}
        width={width}
      />
      <div aria-hidden="true" className="relative">
        <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-gray-50 pt-[7%] dark:from-background" />
      </div>
    </div>
  )
}
