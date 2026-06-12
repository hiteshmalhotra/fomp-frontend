import { useNavigate, useLocation } from 'react-router-dom'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { ROLE_HOME_ROUTES } from '@/utils/constants'
import { useRateLimit } from '@/pages/auth/_shared/hooks/useRateLimit'
import type { JwtPayload } from '@/types/auth.types'
import { loginSchema, type LoginFormValues } from '../validation/login.schema'

export const useLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const { message } = App.useApp()
  const { countdown, start: startRateLimit, isLimited } = useRateLimit()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (values: LoginFormValues) => {
    if (isLimited) return
    setLoading(true)
    try {
      const res = await authApi.login({
        email: values.email,
        password: values.password,
      })
      const decoded = jwtDecode<JwtPayload>(res.data.token)
      setAuth(res.data.token, {
        userId: decoded.userId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
      })
      const from = (
        location.state as { from?: { pathname: string } }
      )?.from?.pathname
      const destination =
        from && from !== '/login'
          ? from
          : ROLE_HOME_ROUTES[decoded.role] ?? '/profile'
      message.success(`Welcome back, ${decoded.firstName}!`)
      navigate(destination, { replace: true })
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string; message?: string }; status?: number }
        retryAfter?: number
      }
      const errorCode = error?.response?.data?.error
      const status = error?.response?.status
      if (status === 429 && error.retryAfter) {
        startRateLimit(error.retryAfter)
        message.error(`Too many attempts. Try again in ${error.retryAfter}s.`)
        return
      }
      if (errorCode === 'INVALID_CREDENTIALS') {
        form.setError('email', { message: ' ' })
        form.setError('password', { message: 'Invalid email or password.' })
        return
      }
      message.error(
        error?.response?.data?.message ?? 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    countdown,
    isLimited,
    onSubmit: form.handleSubmit(onSubmit),
  }
}