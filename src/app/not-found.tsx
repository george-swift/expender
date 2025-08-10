import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Container } from '@/components/container'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 h-full pt-16 sm:pt-32">
      <p className="text-base font-semibold">404</p>
      <p className="text-4xl font-bold tracking-tight">Page not found</p>
      <p className="text-base text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
        Go back home
      </Link>
    </Container>
  )
}
