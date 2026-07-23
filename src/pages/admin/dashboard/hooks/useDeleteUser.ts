import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { adminApi } from '@/api/admin.api'

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
    onError: (err: any) => {
      message.error(
        err?.response?.data?.message ?? 'Failed to delete user. Try again.'
      )
    },
  })
}