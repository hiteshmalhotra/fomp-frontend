import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { adminApi } from '@/api/admin.api'
import type { AdminUser } from '@/types/admin.types'
import type { PaginatedData } from '@/types/common.types'

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => adminApi.toggleStatus(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['admin', 'users'] })

      const previous = queryClient.getQueryData<PaginatedData<AdminUser>>([
        'admin',
        'users',
      ])

      queryClient.setQueryData<PaginatedData<AdminUser>>(
        ['admin', 'users'],
        (old) =>
          old
            ? {
                ...old,
                content: old.content.map((u) =>
                  u.id === id ? { ...u, enabled: !u.enabled } : u
                ),
              }
            : old
      )

      return { previous }
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['admin', 'users'], context.previous)
      }
      message.error('Failed to update status. Please try again.')
    },

    onSuccess: () => {
      message.success('User status updated.')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}