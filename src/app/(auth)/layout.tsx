export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
