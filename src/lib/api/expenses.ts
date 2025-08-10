import { apiClient, handleAPIResponseError } from '@/lib/api'

export async function getExpenses() {
  const response = await apiClient({
    path: '/expenses',
    options: { cache: 'force-cache' }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to fetch expenses')
  }

  const data = await response.json()
  return { data, error: null }
}
