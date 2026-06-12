import apiClient from './client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth.types'
import type { ApiSuccess } from '@/types/common.types'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient
      .post<ApiSuccess<LoginResponse>>('/api/auth/login', data)
      .then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient
      .post<ApiSuccess<null>>('/api/auth/register', data)
      .then((r) => r.data),

  logout: () =>
    apiClient
      .post<ApiSuccess<null>>('/api/auth/logout')
      .then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient
      .post<ApiSuccess<null>>('/api/auth/forgot-password', data)
      .then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient
      .post<ApiSuccess<null>>('/api/auth/reset-password', data)
      .then((r) => r.data),
}