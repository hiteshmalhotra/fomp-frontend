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
export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number        // seconds
  email: string
  firstName: string
  lastName: string
  role: string             // raw role string from backend
}

// NOTE: form-value types live next to their zod schemas
// (z.infer in each validation/*.schema.ts) — not here.
