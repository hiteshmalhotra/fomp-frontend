import { z } from 'zod'

/**
 * Single source of truth for the password policy.
 * Mirrors backend RegisterRequest exactly:
 *   ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
 * Consumed by every auth/admin schema AND the strength indicator,
 * so what the meter shows is exactly what the form enforces.
 */

export interface PasswordRule {
  key: string
  label: string
  test: (value: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
  { key: 'length',    label: 'Minimum 8 characters',              test: (v) => v.length >= 8 },
  { key: 'lowercase', label: 'One lowercase letter',              test: (v) => /[a-z]/.test(v) },
  { key: 'uppercase', label: 'One uppercase letter',              test: (v) => /[A-Z]/.test(v) },
  { key: 'number',    label: 'One number',                        test: (v) => /[0-9]/.test(v) },
  { key: 'special',   label: 'One special character (@$!%*?&)',   test: (v) => /[@$!%*?&]/.test(v) },
]

// Backend restricts the allowed character set — reject early on the client
// so users never hit a confusing 400 for using e.g. "#".
const ALLOWED_CHARSET = /^[A-Za-z\d@$!%*?&]*$/

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)')
  .regex(ALLOWED_CHARSET, 'Only letters, numbers and @$!%*?& are allowed')
