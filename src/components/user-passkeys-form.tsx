import { useState, useTransition } from 'react'
import { useReverification } from '@clerk/nextjs'
import {
  isClerkAPIResponseError,
  isClerkRuntimeError,
  isReverificationCancelledError
} from '@clerk/nextjs/errors'
import { PasskeyResource, UserResource } from '@clerk/types'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { cn, isWebAuthnSupported } from '@/lib/utils'
import { UserPasskey, userPasskeySchema } from '@/lib/validations/user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PasskeyIcon } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

dayjs.extend(relativeTime)

export function UserPasskeysForm({ user }: { user: UserResource | null }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [pending, startTransition] = useTransition()

  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<UserPasskey>({
    defaultValues: { id: '', name: null },
    mode: 'onBlur',
    resolver: zodResolver(userPasskeySchema)
  })

  const formValues = watch()

  const [creatingPasskey, setIsCreatingPasskey] = useState(false)

  const createPasskey = useReverification(() => user?.createPasskey())

  const [deletingPasskeys, setDeletingPasskeys] = useState<
    Record<string, boolean>
  >({})

  const deletePasskey = useReverification((passkey: PasskeyResource) =>
    passkey.delete()
  )

  if (!user) return null

  const handlePasskeyCreation = async () => {
    if (!user) return

    if (!isWebAuthnSupported()) {
      toast.error('Passkeys not supported', {
        description: "Your browser or device doesn't support passkeys."
      })
      return
    }

    setIsCreatingPasskey(true)

    try {
      await createPasskey()
      toast.success('Passkey created successfully')
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        toast.error('Unable to add passkey', {
          description: err.errors?.[0]?.longMessage
        })
      } else {
        if (isClerkRuntimeError(err) && isReverificationCancelledError(err)) {
          toast.warning('Reverification cancelled')
          return
        }
        toast.error('An unexpected error occurred while creating the passkey.')
      }
    } finally {
      setIsCreatingPasskey(false)
    }
  }

  const onEditPasskey = ({ id, name }: UserPasskey) => {
    setValue('id', id, { shouldDirty: true, shouldValidate: true })
    setValue('name', name, { shouldDirty: true, shouldValidate: true })
    setIsEditMode(true)
  }

  const onReset = ({ id, name }: UserPasskey) => {
    reset({ id, name })
    setIsEditMode(false)
  }

  const onSubmit = (formValues: UserPasskey) => {
    if (!user) return

    startTransition(async () => {
      try {
        const passkeyToUpdate = user.passkeys?.find(
          (pk: PasskeyResource) => pk.id === formValues.id
        )
        await passkeyToUpdate?.update({ name: formValues.name })
        toast.success('Passkey updated successfully')
        setIsEditMode(false)
      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          toast.error('Failed to update passkey', {
            description: error.errors?.[0]?.longMessage
          })
        } else {
          toast.error(
            'An unexpected error occurred while updating the passkey.'
          )
        }
      }
    })
  }

  const handleDeletePasskey = async (passkey: PasskeyResource) => {
    if (!user) return

    setDeletingPasskeys(prev => ({ ...prev, [passkey.id]: true }))
    try {
      await deletePasskey(passkey)
      toast.success('Passkey deleted successfully')
      reset({ id: '', name: null })
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        toast.error('Failed to delete passkey', {
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
        toast.error('An unexpected error occurred while deleting the passkey.')
      }
    } finally {
      setDeletingPasskeys(prev => ({ ...prev, [passkey.id]: false }))
    }
  }

  return (
    <form
      className="grid grid-cols-1 gap-x-8 gap-y-10 border-b py-12 lg:grid-cols-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h2 className="text-base/7 font-semibold">Passkeys</h2>
        <p className="mt-1 text-sm/6 text-muted-foreground">
          Passkeys are web authentication credentials that validate your
          identity using touch, facial recognition, a device password, or a PIN.
        </p>
      </div>

      <dl className="grid max-w-2xl grid-cols-1 items-start gap-2 sm:grid-cols-6 lg:col-span-2">
        <div className="col-span-full flex items-center justify-between gap-2">
          <dt className="text-sm leading-none select-none">Your passkeys</dt>
          <Button
            className="min-w-32 shadow-xs"
            disabled={isEditMode}
            isLoading={creatingPasskey}
            onClick={handlePasskeyCreation}
            type="button"
            variant="outline"
          >
            Add a passkey
          </Button>
        </div>

        <dd className="col-span-full text-sm/6">
          <ul className="divide-y rounded-md border">
            {user.passkeys?.length ? (
              user.passkeys.map((passkey, index) => (
                <li
                  className={cn(
                    'flex items-center justify-between p-4 text-sm/6',
                    { 'max-sm:flex-col max-sm:gap-4': isEditMode }
                  )}
                  key={index}
                >
                  {isEditMode && formValues.id === passkey.id ? (
                    <>
                      <div className="space-y-2 shrink-0 flex-1">
                        <Input
                          {...register('name')}
                          className="w-full"
                          placeholder="Enter a name for your passkey"
                        />
                        {errors?.name && (
                          <p className="text-destructive text-sm">
                            {errors?.name?.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center shrink-0 space-x-2 max-sm:w-full max-sm:*:basis-1/2 sm:ml-4">
                        <Button
                          disabled={pending || !isDirty || !isValid}
                          isLoading={pending}
                          size="sm"
                          type="submit"
                        >
                          Save
                        </Button>
                        <Button
                          disabled={pending}
                          onClick={() => {
                            onReset(passkey)
                          }}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5 w-0 flex-1">
                        <div className="flex items-center gap-4">
                          <PasskeyIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-muted-foreground"
                          />
                          <div className="flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {passkey.name}
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline">
                                  {passkey.verification?.status}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The verification details for the passkey.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex flex-col items-start shrink-0 text-xs text-muted-foreground space-x-2 sm:flex-row sm:items-center">
                          <span>
                            Added on{' '}
                            {dayjs(passkey.createdAt).format('MMMM D, YYYY')}
                          </span>
                          <Separator
                            className="max-sm:hidden data-[orientation=vertical]:h-3"
                            orientation="vertical"
                          />
                          <span>
                            Last used {dayjs(passkey.lastUsedAt).fromNow()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center shrink-0 space-x-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => {
                                onEditPasskey(passkey)
                              }}
                              size="icon"
                              type="button"
                              variant="ghost"
                            >
                              <PencilIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit passkey name</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="hover:bg-destructive/90 hover:text-white"
                              isLoading={deletingPasskeys[passkey.id]}
                              onClick={() => {
                                handleDeletePasskey(passkey)
                              }}
                              size="icon"
                              type="button"
                              variant="ghost"
                            >
                              <Trash2Icon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete passkey</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li className="p-4 text-sm/6">
                No passkeys created for this account
              </li>
            )}
          </ul>
        </dd>
      </dl>
    </form>
  )
}
