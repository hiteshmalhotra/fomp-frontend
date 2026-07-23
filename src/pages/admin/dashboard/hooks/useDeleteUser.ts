import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { adminApi } from '@/api/admin.api'
import { getApiError } from '@/utils/apiError'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => {
      message.success('User deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-counts'] })
    },
    onError: (err: unknown) => {
      message.error(
        getApiError(err).message ?? 'Failed to delete user. Try again.'
      )
    },
  })
}