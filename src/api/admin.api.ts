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
  getUsers: (params: GetUsersParams) =>
    apiClient
      .get<ApiSuccess<PaginatedData<AdminUser>>>('/api/admin/users', { params })
      .then((r) => r.data.data),

  getUserCounts: () =>
    apiClient
      .get<ApiSuccess<UserCounts>>('/api/admin/users/count')
      .then((r) => r.data.data),

  getUserById: (id: number) =>
    apiClient
      .get<ApiSuccess<AdminUser>>(`/api/admin/users/${id}`)
      .then((r) => r.data.data),

  createUser: (data: CreateUserRequest) =>
    apiClient
      .post<ApiSuccess<AdminUser>>('/api/admin/users/create', data)
      .then((r) => r.data.data),

  deleteUser: (id: number) =>
    apiClient
      .delete<ApiSuccess<null>>(`/api/admin/users/${id}`)
      .then((r) => r.data),

  toggleStatus: (id: number) =>
    apiClient
      .patch<ApiSuccess<AdminUser>>(`/api/admin/users/${id}/status`)
      .then((r) => r.data.data),

  changeRole: (id: number, data: ChangeRoleRequest) =>
    apiClient
      .patch<ApiSuccess<AdminUser>>(`/api/admin/users/${id}/role`, data)
      .then((r) => r.data.data),
}