import ClerkProvider from '@/app/providers/clerk'
import LenisScrollProvider from '@/app/providers/lenis'
import ThemeProvider from '@/app/providers/next-themes'
import NuqsProvider from '@/app/providers/nuqs'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <NuqsProvider>
        <LenisScrollProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LenisScrollProvider>
      </NuqsProvider>
    </ClerkProvider>
  )
}
