import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useReverification } from '@clerk/nextjs'
import {
  isClerkAPIResponseError,
  isClerkRuntimeError,
  isReverificationCancelledError
} from '@clerk/nextjs/errors'
import { UserResource } from '@clerk/types'
import { UserRoundMinusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useDialog } from '@/hooks/use-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

export function UserAccountDeletionForm({
  user
}: {
  user: UserResource | null | undefined
}) {
  const router = useRouter()
  const confirmationDialog = useDialog()

  const [pending, startTransition] = useTransition()

  const deleteUser = useReverification(() => user?.delete())

  if (!user) return null

  const handleAccountDeletion = () => {
    startTransition(async () => {
      try {
        await deleteUser()
        toast.success('Account deleted successfully')
        router.push('/')
      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          toast.error('Failed to delete account', {
            description: error.errors?.[0]?.longMessage
          })
        } else {
          if (
            isClerkRuntimeError(error) &&
            isReverificationCancelledError(error)
          ) {
            toast.warning('Reverification cancelled')
            return
          }
          toast.error(
            'An unexpected error occurred while deleting the account.'
          )
        }
      }

      confirmationDialog.dismiss()
    })
  }

  return (
    <form className="grid grid-cols-1 gap-x-8 gap-y-10 py-12 md:grid-cols-3">
      <h2 className="text-base/7 font-semibold text-destructive">
        Delete Account
      </h2>

      <div className="grid max-w-2xl grid-cols-1 justify-end items-end sm:grid-cols-6 md:col-span-2">
        <div className="col-span-full">
          <p className="mb-1 text-sm/6 text-muted-foreground">
            Once you delete your account on Expender, there is no going back.
            All data associated with your account will be permanently removed
            and unrecoverable.
          </p>
          <div className="w-full flex justify-end">
            <Button
              className="min-w-32 text-white ml-auto"
              onClick={confirmationDialog.trigger}
              type="button"
              variant="destructive"
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>

      <Dialog {...confirmationDialog.dialogProps}>
        <DialogContent>
          <DialogHeader className="items-center">
            <UserRoundMinusIcon className="size-8 mb-2" />
            <DialogTitle>Confirm Account Deletion</DialogTitle>
            <DialogDescription className="text-center">
              All your data will be permanently removed after deleting your
              account. Please be certain.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 grid-cols-2">
            <Button
              onClick={confirmationDialog.dismiss}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              isLoading={pending}
              onClick={handleAccountDeletion}
              variant="destructive"
            >
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}
