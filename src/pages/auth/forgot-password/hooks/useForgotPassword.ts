import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth.api'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../validation/forgotPassword.schema'

export const useForgotPassword = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true)
    try {
      await authApi.forgotPassword({ email: values.email })
      message.success('Verification code sent. Please check your email.')
      navigate('/reset-password', { state: { email: values.email } })
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } }
      }
      message.error(
        error?.response?.data?.message ?? 'Failed to send code. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, onSubmit: form.handleSubmit(onSubmit) }
}