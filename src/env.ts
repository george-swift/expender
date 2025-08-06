import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_AWS_REGION: z.string(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
    NEXT_PUBLIC_SENTRY_ORG: z.string(),
    NEXT_PUBLIC_SENTRY_PROJECT: z.string()
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT:
      process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_ORG: process.env.NEXT_PUBLIC_SENTRY_ORG,
    NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT
  },
  server: {
    API_BASE_URL: z.string().url(),
    CDN_BASE_URL: z.string().url(),
    SENTRY_AUTH_TOKEN: z.string()
  }
})
