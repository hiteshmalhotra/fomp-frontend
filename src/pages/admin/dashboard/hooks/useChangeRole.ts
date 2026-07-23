import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { adminApi } from '@/api/admin.api'
import { getApiError } from '@/utils/apiError'
import type { UserRole } from '@/types/auth.types'

export const useChangeRole = (onSuccessClose: () => void) => {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      adminApi.changeRole(id, { role }),
    onSuccess: () => {
      message.success('Role updated successfully.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      onSuccessClose()
    },
    onError: (err: unknown) => {
      message.error(
        getApiError(err).message ?? 'Failed to update role. Try again.'
      )
    },
  })
}