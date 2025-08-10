'use server'

import { revalidatePath } from 'next/cache'

import { ExportFormat, PresignedS3PostURLResponse } from '@/types/expenses'

import { apiClient, handleAPIResponseError } from '@/lib/api'
import { smartScanFileTypes } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'

function revalidateExpenses() {
  revalidatePath('/dashboard')
  revalidatePath('/expenses')
}

export async function createExpense(expense: Expense) {
  const response = await apiClient({
    path: '/expenses',
    options: { method: 'POST', body: JSON.stringify(expense) }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to create expense')
  }

  revalidateExpenses()
}

export async function createExpenses(expenses: Expense[]) {
  const response = await apiClient({
    path: '/expenses/batch',
    options: { method: 'POST', body: JSON.stringify(expenses) }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to create expenses')
  }

  revalidateExpenses()
}

export async function deleteExpense(expenseId: string) {
  const response = await apiClient({
    path: `/expenses/${expenseId}`,
    options: { method: 'DELETE' }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to delete expense')
  }

  revalidateExpenses()
}

export async function deleteExpenses(expenseIds: string[]) {
  const response = await apiClient({
    path: '/expenses/batch',
    options: { method: 'DELETE', body: JSON.stringify(expenseIds) }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to delete expenses')
  }

  revalidateExpenses()
}

export async function updateExpense(expense: Expense) {
  const response = await apiClient({
    path: `/expenses/${expense.expenseId}`,
    options: { method: 'PUT', body: JSON.stringify(expense) }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to update expense')
  }

  revalidateExpenses()
}

export async function exportExpenses(payload: {
  format: ExportFormat
  attributes: (keyof Expense)[]
}) {
  const response = await apiClient({
    path: `/expenses/export`,
    options: { method: 'POST', body: JSON.stringify(payload) }
  })

  if (!response.ok) {
    return handleAPIResponseError(response, 'Failed to export expenses.')
  }

  return { data: await response.blob(), error: null }
}

export async function createPresignedPostURLForUploads(file: File) {
  if (!file || !smartScanFileTypes.includes(file.type)) {
    return {
      data: null,
      error: 'Invalid file type. Supported types are JPEG, PNG, or PDF.'
    }
  }

  const response = await apiClient({
    path: '/smartscans',
    options: {
      method: 'POST',
      body: JSON.stringify({ contentType: file.type })
    }
  })

  if (!response.ok) {
    return handleAPIResponseError(
      response,
      'Failed to get upload URL for Smart Scan'
    )
  }

  const data: PresignedS3PostURLResponse = await response.json()

  return { data, error: null }
}
