import { z } from 'zod'

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .max(50, 'First name must be 50 characters or less')
    .nullable(),
  lastName: z
    .string()
    .max(50, 'Last name must be 50 characters or less')
    .nullable(),
  imageUrl: z.string().url('Invalid image URL').nullable()
})

export type UserProfile = z.infer<typeof userProfileSchema>

export const userPasskeySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .max(50, 'Passkey name must be 50 characters or less')
    .nullable()
})

export type UserPasskey = z.infer<typeof userPasskeySchema>
