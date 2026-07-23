import apiClient from './client'
import type { PaginatedData } from '@/types/common.types'
import type {
  AdminUser,
  CreateUserRequest,
  ChangeRoleRequest,
  GetUsersParams,
  UserCounts,
} from '@/types/admin.types'
import type { ApiSuccess } from '@/types/common.types'

export const adminApi = {
  // signal: React Query's AbortSignal — cancels in-flight requests
  // when the query is superseded (page/filter change) or unmounted.
  getUsers: (params: GetUsersParams, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<AdminUser>>>('/api/admin/users', {
        params,
        signal,
      })
      .then((r) => r.data.data),

  getUserCounts: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<UserCounts>>('/api/admin/users/count', { signal })
      .then((r) => r.data.data),

  getUserById: (id: number, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<AdminUser>>(`/api/admin/users/${id}`, { signal })
      .then((r) => r.data.data),

  createUser: (data: CreateUserRequest) =>
    apiClient
      .post<ApiSuccess<AdminUser>>('/api/admin/users/create', data)
      .then((r) => r.data.data),

  deleteUser: (id: number) =>
    apiClient
      .delete<ApiSuccess<null>>(`/api/admin/users/${id}`)
      .then((r) => r.data.data),

  toggleStatus: (id: number) =>
    apiClient
      .patch<ApiSuccess<AdminUser>>(`/api/admin/users/${id}/status`)
      .then((r) => r.data.data),

  changeRole: (id: number, data: ChangeRoleRequest) =>
    apiClient
      .patch<ApiSuccess<AdminUser>>(`/api/admin/users/${id}/role`, data)
      .then((r) => r.data.data),
}
