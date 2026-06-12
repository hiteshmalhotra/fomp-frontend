import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/auth.api'
import { registerSchema, type RegisterFormValues } from '../validation/register.schema'

export const useRegister = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true)
    try {
      await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      })
      message.success('Account created successfully. Please sign in.')
      navigate('/login')
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string; message?: string } }
      }
      const errorCode = error?.response?.data?.error
      if (errorCode === 'EMAIL_ALREADY_EXISTS') {
        form.setError('email', {
          message: 'An account with this email already exists.',
        })
        return
      }
      message.error(
        error?.response?.data?.message ?? 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, onSubmit: form.handleSubmit(onSubmit) }
}