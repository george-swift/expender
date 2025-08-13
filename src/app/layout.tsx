import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'

import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/app/providers'

import '@/styles/globals.css'

import { cn } from '@/lib/utils'

const haffer = localFont({
  display: 'swap',
  src: [
    {
      path: '../fonts/Haffer.woff',
      style: 'normal',
      weight: '400'
    },
    {
      path: '../fonts/Haffer-Bold.woff',
      style: 'normal',
      weight: '700'
    }
  ],
  variable: '--font-haffer'
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://expender.vercel.app'
  ),
  title: {
    default: 'Expender - Smart Expense Management',
    template: '%s | Expender'
  },
  description:
    'A modern expense tracker with AI-powered receipt scanning, intelligent categorization, and comprehensive expense management features. Track expenses effortlessly with SmartScan technology.',
  keywords: [
    'expense tracker',
    'receipt scanner',
    'expense management',
    'AI receipt scanning',
    'SmartScan',
    'expense analytics',
    'budget tracking',
    'financial management',
    'expense app',
    'receipt processing'
  ],
  authors: [{ name: 'Ubong George', url: 'https://github.com/george-swift' }],
  creator: 'Ubong George',
  publisher: 'Expender',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Expender',
    title: 'Expender - Smart Expense Management',
    description:
      'A modern expense tracker with AI-powered receipt scanning, intelligent categorization, and comprehensive expense management features. Track expenses effortlessly with SmartScan technology.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Expender - Smart Expense Management Dashboard',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expender - Smart Expense Management',
    description:
      'Track expenses effortlessly with AI-powered receipt scanning and intelligent categorization.',
    images: ['/og.png']
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'icon',
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ]
  },
  manifest: '/favicon/site.webmanifest',
  alternates: {
    canonical: '/'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn('h-auto antialiased', haffer.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="h-full font-sans select-none bg-gray-50 dark:bg-zinc-950">
        <Providers>
          {children}
          <Toaster richColors />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
