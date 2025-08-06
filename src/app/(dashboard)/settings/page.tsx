'use client'

import { useUser } from '@clerk/nextjs'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAccountDeletionForm } from '@/components/user-account-deletion-form'
import { UserPasskeysForm } from '@/components/user-passkeys-form'
import { UserProfileForm } from '@/components/user-profile-form'

export default function SettingsPage() {
  const { isLoaded, user } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Skeleton className="min-h-[200px] rounded-xl" />
        <Skeleton className="min-h-[200px] rounded-xl" />
        <Skeleton className="min-h-[200px] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="pt-10 pb-6 px-4 lg:px-6">
      <UserProfileForm user={user} />
      <UserPasskeysForm user={user} />
      <UserAccountDeletionForm user={user} />
    </div>
  )
}
