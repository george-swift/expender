import Image, { ImageProps } from 'next/image'

import { cn } from '@/lib/utils'

export function ReceiptAvatar({
  className,
  imageClassName,
  alt = '',
  ...props
}: {
  className?: string
  imageClassName?: string
} & Omit<ImageProps, 'fill'>) {
  return (
    <div
      className={cn(
        'receipt-mask relative size-16.5 shrink-0 ring-1 ring-border bg-border/40 overflow-hidden',
        className
      )}
    >
      <Image
        {...props}
        alt={alt}
        className={cn(
          'pointer-events-none select-none absolute inset-0 size-full object-cover',
          imageClassName
        )}
      />
    </div>
  )
}
