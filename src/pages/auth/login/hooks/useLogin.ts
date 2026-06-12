import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { message } from 'antd'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { getUserFromToken } from '@/utils/jwt'
import { getDashboardRoute } from '@/utils/roleRedirect'
import type { LoginFormValues } from '@/types/auth.types'

// ─── Zod schema — matches backend constraints ─────────────────────────────────
const loginSchema = z.object({
  email:      z.string().min(1, 'Email is required').email('Enter a valid email'),
  password:   z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
})

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const [loading,   setLoading]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLimited, setIsLimited] = useState(false)

  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()
  const location    = useLocation()

  // Redirect to the page the user was trying to visit before being sent to /login
  const from = (location.state as { from?: Location })?.from?.pathname ?? null

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  // ─── Rate limit countdown timer ───────────────────────────────────────────
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

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (values: LoginFormValues) => {
    if (isLimited) return

    setLoading(true)
    try {
      const response = await login({
        email:    values.email,
        password: values.password,
      })

      // Decode JWT to extract user claims — no extra API call needed
      const user = getUserFromToken(response.token)
      if (!user) {
        message.error('Authentication failed. Please try again.')
        return
      }

      // Persist to Zustand store
      setAuth(response.token, user)

      // Redirect: back to original destination OR role dashboard
      const destination = from ?? getDashboardRoute(user.role)
      navigate(destination, { replace: true })

    } catch (err: any) {
      const errorCode    = err?.response?.data?.error
      const errorMessage = err?.response?.data?.message
      const status       = err?.response?.status

      if (status === 429) {
        // Rate limited — start countdown from Retry-After header
        const retryAfter = err?.retryAfter ?? 60
        startCountdown(retryAfter)
        return
      }

      if (errorCode === 'INVALID_CREDENTIALS' || status === 401) {
        // Set error on both fields — don't reveal which one is wrong
        form.setError('email',    { message: '' })
        form.setError('password', {
          message: 'Invalid email or password',
        })
        return
      }

      if (errorCode === 'ACCOUNT_DISABLED') {
        message.error('Your account has been deactivated. Contact your administrator.')
        return
      }

      // Generic fallback
      message.error(errorMessage ?? 'Something went wrong. Please try again.')

    } finally {
      setLoading(false)
    }
  }

  return { form, loading, countdown, isLimited, onSubmit }
}