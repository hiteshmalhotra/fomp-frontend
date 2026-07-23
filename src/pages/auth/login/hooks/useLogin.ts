import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { App } from 'antd'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { getUserFromToken } from '@/utils/jwt'
import { getDashboardRoute } from '@/utils/roleRedirect'
import { getApiError } from '@/utils/apiError'
import type { LoginFormValues } from '@/types/auth.types'

const loginSchema = z.object({
  email:      z.string().min(1, 'Email is required').email('Enter a valid email'),
  password:   z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
})

export const useLogin = () => {
  const { message } = App.useApp()
  const [loading,   setLoading]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLimited, setIsLimited] = useState(false)

  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()
  const location    = useLocation()

  const from = (location.state as { from?: Location })?.from?.pathname ?? null

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const startCountdown = (seconds: number) => {
    setIsLimited(true)
    setCountdown(seconds)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsLimited(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const onSubmit = async (values: LoginFormValues) => {
    if (isLimited) return
    setLoading(true)

    try {
      const response = await login({
        email:    values.email,
        password: values.password,
      })

      const user = getUserFromToken(response.token)
      if (!user) {
        message.error('Authentication failed. Please try again.')
        return
      }

      setAuth(response.token, user)
      navigate(from ?? getDashboardRoute(user.role), { replace: true })

    } catch (err: unknown) {
      const { status, code: errorCode, message: errorMessage, retryAfterSeconds } =
        getApiError(err)

      if (status === 429 || errorCode === 'RATE_LIMIT_EXCEEDED') {
        startCountdown(retryAfterSeconds ?? 60)
        return
      }

      if (status === 401) {
        form.setError('email',    { message: '' })
        form.setError('password', { message: 'Invalid email or password' })
        return
      }

      if (status === 403 || errorCode === 'ACCOUNT_DISABLED') {
        message.error('Your account has been deactivated. Contact your administrator.')
        return
      }

      if (status === 503) {
        message.error('Service is currently unavailable. Please try again later.')
        return
      }

      message.error(errorMessage ?? 'Something went wrong. Please try again.')

    } finally {
      setLoading(false)
    }
  }

  return { form, loading, countdown, isLimited, onSubmit }
}