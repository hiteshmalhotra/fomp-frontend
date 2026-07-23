import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Max 50 characters'),
  lastName: z
    .string()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Max 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  role: z.enum([
    'ROLE_ADMIN',
    'ROLE_STORE_MANAGER',
    'ROLE_KITCHEN_MANAGER',
    'ROLE_CANTEEN_MANAGER',
    'ROLE_USER',
  ]),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>