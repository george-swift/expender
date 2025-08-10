'use server'

import { revalidatePath } from 'next/cache'

export async function refreshQuotaData() {
  revalidatePath('/(dashboard)', 'layout')
}
