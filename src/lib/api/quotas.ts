import { apiClient, handleAPIResponseError } from '@/lib/api'

export async function getQuotas() {
  const response = await apiClient({
    path: '/quotas',
    options: { cache: 'force-cache' }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to fetch quotas')
  }

  const data = await response.json()
  return { data, error: null }
}
