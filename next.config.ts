import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

import { env } from '@/env'

const nextConfig: NextConfig = {
  devIndicators: { position: 'bottom-right' },
  experimental: {
    optimizePackageImports: ['aws-amplify', '@sentry/nextjs'],
    serverActions: {
      bodySizeLimit: '5mb'
    },
    viewTransition: true
  },
  images: {
    remotePatterns: [
      new URL(`${env.CDN_BASE_URL}/**`),
      new URL('https://img.clerk.com/**')
    ]
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx']
}

export default withSentryConfig(nextConfig, {
  org: env.NEXT_PUBLIC_SENTRY_ORG,
  project: env.NEXT_PUBLIC_SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true
})
