import apiClient from '@/api/client'
import type { ApiSuccess } from '@/types/common.types'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth.types'

// Every backend endpoint wraps responses in ApiResponse<T>
// (verified: AuthController uses ApiResponse.success on all routes).

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>(
    '/api/auth/login',
    payload
  )
  return data.data
}

export const register = async (
  payload: RegisterRequest
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>(
    '/api/auth/register',
    payload
  )
  return data.data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout')
}

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<void> => {
  await apiClient.post('/api/auth/forgot-password', payload)
}

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<void> => {
  await apiClient.post('/api/auth/reset-password', payload)
}

export const authApi = {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
}
