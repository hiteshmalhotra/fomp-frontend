import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { App } from 'antd'
import { register } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { getUserFromToken } from '@/utils/jwt'
import { getDashboardRoute } from '@/utils/roleRedirect'
import { getApiError } from '@/utils/apiError'
import {
  registerSchema,
  type RegisterFormValues,
} from '../validation/register.schema'

export const useRegister = () => {
  const { message } = App.useApp()
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

    } catch (err: unknown) {
      const { status, code: errorCode, message: errorMessage, fieldErrors } =
        getApiError(err)

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
        if (fieldErrors?.length) {
          fieldErrors.forEach(({ field, message: msg }) => {
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
