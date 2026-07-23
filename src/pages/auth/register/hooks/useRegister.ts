import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { register } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { getUserFromToken } from '@/utils/jwt'
import { getDashboardRoute } from '@/utils/roleRedirect'
import type { RegisterFormValues } from '@/types/auth.types'

// ─── Zod schema — matches backend constraints exactly ─────────────────────────
// Backend: min 8 chars, at least 1 uppercase, 1 digit
const passwordSchema = z
  .string()
  .min(8,  'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

const registerSchema = z
  .object({
    firstName:       z.string()
                      .min(2,  'First name must be at least 2 characters')
                      .max(50, 'First name must be at most 50 characters')
                      .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
    lastName:        z.string()
                      .min(2,  'Last name must be at least 2 characters')
                      .max(50, 'Last name must be at most 50 characters')
                      .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
    email:           z.string()
                      .min(1, 'Email is required')
                      .email('Enter a valid email address'),
    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path:    ['confirmPassword'],
    }
  )

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useRegister = () => {
  const [loading, setLoading] = useState(false)

  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  const form = useForm<RegisterFormValues>({
    resolver:      zodResolver(registerSchema),
    defaultValues: {
      firstName:       '',
      lastName:        '',
      email:           '',
      password:        '',
      confirmPassword: '',
    },
    mode: 'onBlur',   // validate on blur — shows errors as user fills each field
  })

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true)
    try {
      const response = await register({
        firstName: values.firstName.trim(),
        lastName:  values.lastName.trim(),
        email:     values.email.toLowerCase().trim(),
        password:  values.password,
      })

      // Backend returns JWT on register — auto-login, no redirect to /login
      const user = getUserFromToken(response.token)
      if (!user) {
        message.error('Registration succeeded but login failed. Please sign in.')
        navigate('/login', { replace: true })
        return
      }

      // Persist to Zustand
      setAuth(response.token, user)

      message.success(`Welcome, ${user.firstName}! Your account has been created.`)

      // New users always get ROLE_USER — goes to /profile
      navigate(getDashboardRoute(user.role), { replace: true })

    } catch (err: any) {
      const errorCode    = err?.response?.data?.error
      const errorMessage = err?.response?.data?.message
      const status       = err?.response?.status

      if (status === 409 || errorCode === 'EMAIL_ALREADY_EXISTS') {
        // Set inline error on email field — keep form open
        form.setError('email', {
          type:    'manual',
          message: 'This email is already registered. Sign in instead?',
        })
        return
      }

      if (status === 400 || errorCode === 'VALIDATION_ERROR') {
        // Backend validation error — surface on the relevant field if possible
        const fields = err?.response?.data?.errors as
          { field: string; message: string }[] | undefined

        if (fields?.length) {
          fields.forEach(({ field, message: msg }) => {
            const key = field as keyof RegisterFormValues
            form.setError(key, { type: 'manual', message: msg })
          })
          return
        }
      }

      // Generic fallback
      message.error(errorMessage ?? 'Registration failed. Please try again.')

    } finally {
      setLoading(false)
    }
  }

  return { form, loading, onSubmit: form.handleSubmit(onSubmit) }
}