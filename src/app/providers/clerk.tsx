import { ClerkProvider as ClerkAuthProvider } from '@clerk/nextjs'

export default function ClerkProvider({
  children
}: {
  children: React.ReactNode
}) {
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>
}
