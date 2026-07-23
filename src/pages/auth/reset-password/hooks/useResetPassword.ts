import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth.api'
import { getApiError } from '@/utils/apiError'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../validation/resetPassword.schema'

export const OTP_EXPIRY_SECONDS = 300 // 5 minutes — matches backend OtpService TTL

export const useResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const email = (location.state as { email?: string })?.email ?? ''
  const hasValidState = !!email

  // ─── Real expiry countdown ────────────────────────────────────────────
  const [expiresIn, setExpiresIn] = useState(OTP_EXPIRY_SECONDS)
  const [timerEpoch, setTimerEpoch] = useState(0) // bump to restart timer

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timerEpoch])

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  })

  // ─── Resend code in place — no round-trip to /forgot-password ─────────
  const resend = async () => {
    if (!email || resending) return
    setResending(true)
    try {
      await authApi.forgotPassword({ email })
      message.success('A new verification code has been sent.')
      form.setValue('otp', '')
      form.clearErrors('otp')
      setExpiresIn(OTP_EXPIRY_SECONDS)
      setTimerEpoch((n) => n + 1)
    } catch (err: unknown) {
      message.error(
        getApiError(err).message ?? 'Failed to resend code. Please try again.'
      )
    } finally {
      setResending(false)
    }
  }

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
      const { code } = getApiError(err)
      if (code === 'INVALID_OTP' || code === 'OTP_EXPIRED') {
        form.setError('otp', {
          message: 'Invalid or expired code. Please request a new one.',
        })
        return
      }
      message.error(
        getApiError(err).message ?? 'Reset failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    email,
    hasValidState,
    expiresIn,
    resend,
    resending,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
