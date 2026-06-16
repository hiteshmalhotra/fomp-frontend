import apiClient from '@/api/client'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth.types'

// ── Unwrap ApiResponse<T> envelope ────────────────────────────────────────────
// Handles both:
//   Wrapped:   { success: true, data: { token, ... }, message: "..." }
//   Unwrapped: { token, ... }  ← fallback during backend transition
const unwrap = <T>(response: { data: any }): T => {
  const body = response.data
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data as T
  }
  return body as T
}

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/login', payload)
  return unwrap<AuthResponse>(response)
}

export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/register', payload)
  return unwrap<AuthResponse>(response)
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