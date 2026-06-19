import type { UserRole } from './auth.types'

export interface AdminUser {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: UserRole
  roleLabel: string
  enabled: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
}

export interface ChangeRoleRequest {
  role: UserRole
}

export interface GetUsersParams {
  search?: string
  role?: string
  status?: string
  page?: number
  size?: number
}

export interface UserCounts {
  [key: string]: number
}