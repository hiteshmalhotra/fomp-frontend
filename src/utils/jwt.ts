import type { JwtPayload, User } from '@/types/auth.types'

/**
 * Decode a JWT token without verifying the signature.
 * Signature verification happens on the backend on every request.
 * We only decode client-side to extract claims for UI purposes.
 */
const decodeToken = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Base64url → Base64 → decode
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded  = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
    const decoded = atob(padded)
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Extract User object from JWT claims.
 * Called after login — avoids an extra GET /api/user/profile call on every load.
 */
export const getUserFromToken = (token: string): User | null => {
  const payload = decodeToken(token)
  if (!payload) return null

  return {
    id:        payload.userId,
    firstName: payload.firstName,
    lastName:  payload.lastName,
    email:     payload.sub,
    role:      payload.role,
  }
}

/**
 * Check if a token is expired based on the exp claim.
 * Used on app load to decide whether to clear auth state.
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token)
  if (!payload) return true
  // exp is epoch seconds — Date.now() is milliseconds
  return payload.exp * 1000 < Date.now()
}

/**
 * Get remaining lifetime of a token in seconds.
 * Used for display purposes (session timeout warnings).
 */
export const getTokenRemainingSeconds = (token: string): number => {
  const payload = decodeToken(token)
  if (!payload) return 0
  const remaining = Math.floor((payload.exp * 1000 - Date.now()) / 1000)
  return Math.max(0, remaining)
}