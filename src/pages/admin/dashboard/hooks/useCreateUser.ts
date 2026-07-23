import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminApi } from '@/api/admin.api'
import { getApiError } from '@/utils/apiError'
import {
  createUserSchema,
  type CreateUserFormValues,
} from '../validation/createUser.schema'

export const useCreateUser = (onSuccessClose: () => void) => {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'ROLE_USER',
    },
  })

  const mutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      message.success('User created successfully.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-counts'] })
      form.reset()
      onSuccessClose()
    },
    onError: (err: unknown) => {
      const { code, message: apiMessage } = getApiError(err)
      if (code === 'EMAIL_ALREADY_EXISTS') {
        form.setError('email', {
          message: 'An account with this email already exists.',
        })
        return
      }
      message.error(apiMessage ?? 'Failed to create user. Try again.')
    },
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return { form, onSubmit, loading: mutation.isPending }
}
