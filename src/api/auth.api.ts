import apiClient from '@/api/client'
import type {
  ApiResponse,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth.types'

/**
 * POST /api/auth/login
 * Returns JWT token + user summary on success.
 * Throws with error.response.data on failure — handled by useLogin hook.
 */
export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    '/api/auth/login',
    payload
  )
  return data.data
}

/**
 * POST /api/auth/register
 * Creates ROLE_USER account, returns JWT + user summary.
 * Throws 409 EMAIL_ALREADY_EXISTS if email is taken.
 */
export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    '/api/auth/register',
    payload
  )
  return data.data
}

/**
 * POST /api/auth/logout
 * Blacklists current JWT in Redis.
 * Always call clearAuth() in Zustand after this — regardless of response.
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout')
}

/**
 * POST /api/auth/forgot-password
 * Sends OTP to email if it exists.
 * Always returns 200 — never reveals if email exists.
 */
export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<void> => {
  await apiClient.post('/api/auth/forgot-password', payload)
}

/**
 * POST /api/auth/reset-password
 * Validates OTP and sets new password.
 * Throws 400 INVALID_OTP or 422 if OTP expired.
 */
export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<void> => {
  await apiClient.post('/api/auth/reset-password', payload)
}

// Named object export — for hooks that prefer authApi.login() style
export const authApi = {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
}