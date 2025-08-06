import ClerkProvider from '@/app/providers/clerk'
import ThemeProvider from '@/app/providers/next-themes'
import NuqsProvider from '@/app/providers/nuqs'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <NuqsProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </NuqsProvider>
    </ClerkProvider>
  )
}
