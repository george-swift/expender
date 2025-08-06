import 'server-only'

import { auth } from '@clerk/nextjs/server'

import { env } from '@/env'
import { ApiError } from '@/types/api'

export const apiClient = async ({
  path,
  options = {}
}: {
  path: string
  options?: RequestInit
}) => {
  const { getToken } = await auth.protect()

  return fetch(`${env.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `${await getToken()}`,
      'Content-Type': 'application/json'
    }
  })
}

export async function handleApiError(response: Response, fallback: string) {
  const error = (await response.json()) as ApiError

  return {
    data: null,
    error: `${error.Code ?? response.status} Error: ${error.Message ?? fallback}`
  }
}
