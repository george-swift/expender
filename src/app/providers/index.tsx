import ClerkProvider from '@/app/providers/clerk'
import ThemeProvider from '@/app/providers/next-themes'
import NuqsProvider from '@/app/providers/nuqs'
import SmoothScrollProvider from '@/app/providers/smooth-scroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <NuqsProvider>
        <ThemeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </NuqsProvider>
    </ClerkProvider>
  )
}
