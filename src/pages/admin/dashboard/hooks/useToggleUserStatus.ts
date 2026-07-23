import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { adminApi } from '@/api/admin.api'
import type { AdminUser } from '@/types/admin.types'
import type { PaginatedData } from '@/types/common.types'

const USERS_KEY = ['admin', 'users'] as const

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => adminApi.toggleStatus(id),

    // Optimistic flip across every cached page/filter combination —
    // the users key now carries params, so match by prefix.
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: USERS_KEY })

      const previous = queryClient.getQueriesData<PaginatedData<AdminUser>>({
        queryKey: USERS_KEY,
      })

      queryClient.setQueriesData<PaginatedData<AdminUser>>(
        { queryKey: USERS_KEY },
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
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      message.error('Failed to update status. Please try again.')
    },

    onSuccess: () => {
      message.success('User status updated.')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-counts'] })
    },
  })
}
