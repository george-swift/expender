import { useCallback, useEffect, useMemo, useTransition } from 'react'
import Link from 'next/link'
import { useReverification } from '@clerk/nextjs'
import {
  isClerkAPIResponseError,
  isClerkRuntimeError,
  isReverificationCancelledError
} from '@clerk/nextjs/errors'
import { UserResource } from '@clerk/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { UserProfile, userProfileSchema } from '@/lib/validations/user'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function UserProfileForm({ user }: { user: UserResource | null }) {
  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      imageUrl: user?.imageUrl ?? null
    }),
    [user]
  )

  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<UserProfile>({
    defaultValues,
    mode: 'onBlur',
    resolver: zodResolver(userProfileSchema)
  })

  const resetFormValues = useCallback(() => {
    reset(defaultValues, { keepDirty: false })
  }, [reset, defaultValues])

  useEffect(resetFormValues, [resetFormValues])

  const [pending, startTransition] = useTransition()

  const changeUserFirstNameAndLastName = useReverification(
    (names: { firstName: string | null; lastName: string | null }) =>
      user?.update(names)
  )

  const changeUserProfileImage = useReverification((imageUrl: string | null) =>
    user?.setProfileImage({ file: imageUrl })
  )

  if (!user) return null

  const formValues = watch()

  const updateField = (
    name: keyof UserProfile,
    value: UserProfile[keyof UserProfile]
  ) => {
    setValue(name, value, { shouldDirty: true, shouldValidate: true })
  }

  const onSubmit = (formValues: UserProfile) => {
    if (!user) return

    const { imageUrl, ...names } = formValues

    startTransition(async () => {
      try {
        if (imageUrl !== user.imageUrl) {
          await changeUserProfileImage(imageUrl)
        }

        await changeUserFirstNameAndLastName(names)
        toast.success('Profile updated successfully')
      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          toast.error('Failed to update profile', {
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
          toast.error('Something went wrong while updating your profile.')
        }
      }
    })
  }

  return (
    <form
      className="grid grid-cols-1 gap-x-8 gap-y-10 border-b pb-12 lg:grid-cols-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h2 className="text-base/7 font-semibold">Profile</h2>
        <p className="mt-1 text-sm/6 text-muted-foreground">
          All of the fields in this section are optional and can be deleted at
          any time. Please see the{' '}
          <Link className="text-foreground underline" href="#">
            privacy policy
          </Link>{' '}
          to learn more about how this information is used.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 items-center gap-x-4 gap-y-8 sm:grid-cols-6 lg:col-span-2">
        <div className="relative col-span-full xl:col-span-2">
          <ImageUploader
            id="user-profile-photo"
            className="size-[200px] rounded-full"
            maxSize={1_048_576} // 1 MB
            onDelete={() => {
              updateField('imageUrl', null)
            }}
            onUpload={dataUrl => {
              updateField('imageUrl', dataUrl)
            }}
            src={formValues.imageUrl}
          />
        </div>

        <div className="col-span-full space-y-8 xl:col-span-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              aria-invalid={!!errors?.firstName}
              autoComplete="given-name"
              id="first-name"
              type="text"
              {...register('firstName')}
            />
            {errors?.firstName && (
              <p className="text-destructive text-sm">
                {errors?.firstName?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              aria-invalid={!!errors?.lastName}
              autoComplete="family-name"
              id="last-name"
              type="text"
              {...register('lastName')}
            />
            {errors?.lastName && (
              <p className="text-destructive text-sm">
                {errors?.lastName?.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-full flex items-center justify-end gap-x-2.5 sm:-mt-4">
          <Button
            className="min-w-32"
            disabled={!(isDirty && isValid)}
            isLoading={pending}
            loadingText="Updating..."
            type="submit"
          >
            Update profile
          </Button>
        </div>
      </div>
    </form>
  )
}
