import type { NextConfig } from 'next'

import { env } from '@/env'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  images: {
    remotePatterns: [
      new URL(`${env.CDN_BASE_URL}/**`),
      new URL('https://img.clerk.com/**')
    ]
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx']
}

export default nextConfig
