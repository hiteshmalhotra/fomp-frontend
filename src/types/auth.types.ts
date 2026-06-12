export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_STORE_MANAGER'
  | 'ROLE_KITCHEN_MANAGER'
  | 'ROLE_CANTEEN_MANAGER'
  | 'ROLE_USER'

export interface JwtPayload {
  userId: number
  firstName: string
  lastName: string
  role: UserRole
  jti: string
  iat: number
  exp: number
}

export interface User {
  userId: number
  firstName: string
  lastName: string
  role: UserRole
  email?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  user: User
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