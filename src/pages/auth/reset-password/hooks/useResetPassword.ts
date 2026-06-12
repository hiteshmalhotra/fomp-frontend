import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth.api'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../validation/resetPassword.schema'

export const useResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const email = (location.state as { email?: string })?.email ?? ''
  const hasValidState = !!email

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!email) return
    setLoading(true)
    try {
      await authApi.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      })
      message.success('Password reset successful. Please sign in.')
      navigate('/login', { replace: true })
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string; message?: string } }
      }
      const errorCode = error?.response?.data?.error
      if (errorCode === 'INVALID_OTP' || errorCode === 'OTP_EXPIRED') {
        form.setError('otp', {
          message: 'Invalid or expired code. Please request a new one.',
        })
        return
      }
      message.error(
        error?.response?.data?.message ?? 'Reset failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, email, hasValidState, onSubmit: form.handleSubmit(onSubmit) }
}