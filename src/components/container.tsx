import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
  wrapperClasses,
  ...props
}: {
  children: React.ReactNode
  wrapperClasses?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(wrapperClasses, 'px-6 lg:px-8')} {...props}>
      <div className={cn('mx-auto max-w-2xl lg:max-w-6xl', className)}>
        {children}
      </div>
    </div>
  )
}
