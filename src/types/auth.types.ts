// ─── Role ─────────────────────────────────────────────────────────────────────
// Exact values from JWT role claim
export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_STORE_MANAGER'
  | 'ROLE_KITCHEN_MANAGER'
  | 'ROLE_CANTEEN_MANAGER'
  | 'ROLE_USER'

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
}

// ─── JWT payload claims ───────────────────────────────────────────────────────
export interface JwtPayload {
  sub: string        // email
  userId: number
  firstName: string
  lastName: string
  role: UserRole
  jti: string        // unique token ID — used by Redis blacklist
  iat: number        // issued at (epoch seconds)
  exp: number        // expires at (epoch seconds)
}

// ─── API request types ────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

// ─── API response types ───────────────────────────────────────────────────────
export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  userId: number
  role: UserRole
}

export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number        // seconds
  email: string
  firstName: string
  lastName: string
  role: string             // raw role string from backend
}

// ─── Form values ──────────────────────────────────────────────────────────────
export interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordFormValues {
  email: string
}

export interface ResetPasswordFormValues {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}

// ─── Standard API envelope ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface ApiError {
  success: false
  error: string       // machine-readable code e.g. INVALID_CREDENTIALS
  message: string     // human-readable
  timestamp: string
}