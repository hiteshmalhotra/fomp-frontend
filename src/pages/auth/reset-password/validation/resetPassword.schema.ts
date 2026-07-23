import { z } from 'zod'
import { passwordSchema } from '@/utils/passwordPolicy'

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, 'Enter the complete 6-digit code')
      .regex(/^\d+$/, 'Code must contain digits only'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
