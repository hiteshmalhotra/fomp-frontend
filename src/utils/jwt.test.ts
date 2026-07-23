import { describe, it, expect } from 'vitest'
import {
  getUserFromToken,
  isTokenExpired,
  getTokenRemainingSeconds,
} from './jwt'
import type { JwtPayload } from '@/types/auth.types'

// Build an unsigned JWT with a base64url-encoded payload
const makeToken = (payload: Partial<JwtPayload>): string => {
  const enc = (o: object) =>
    btoa(JSON.stringify(o))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(payload)}.signature`
}

const futureExp = Math.floor(Date.now() / 1000) + 3600
const pastExp = Math.floor(Date.now() / 1000) - 3600

const validPayload: Partial<JwtPayload> = {
  sub: 'jane@company.com',
  userId: 42,
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'ROLE_ADMIN',
  jti: 'token-id',
  iat: Math.floor(Date.now() / 1000),
  exp: futureExp,
}

describe('getUserFromToken', () => {
  it('extracts the user from JWT claims', () => {
    const user = getUserFromToken(makeToken(validPayload))
    expect(user).toEqual({
      id: 42,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@company.com',
      role: 'ROLE_ADMIN',
    })
  })

  it('returns null for a malformed token', () => {
    expect(getUserFromToken('not-a-jwt')).toBeNull()
    expect(getUserFromToken('a.b')).toBeNull()
    expect(getUserFromToken('')).toBeNull()
  })

  it('returns null when the payload is not valid JSON', () => {
    expect(getUserFromToken('header.!!!.sig')).toBeNull()
  })
})

describe('isTokenExpired', () => {
  it('is false for a token expiring in the future', () => {
    expect(isTokenExpired(makeToken(validPayload))).toBe(false)
  })

  it('is true for an expired token', () => {
    expect(isTokenExpired(makeToken({ ...validPayload, exp: pastExp }))).toBe(
      true
    )
  })

  it('treats malformed tokens as expired', () => {
    expect(isTokenExpired('garbage')).toBe(true)
  })
})

describe('getTokenRemainingSeconds', () => {
  it('returns a positive remaining lifetime', () => {
    const remaining = getTokenRemainingSeconds(makeToken(validPayload))
    expect(remaining).toBeGreaterThan(3590)
    expect(remaining).toBeLessThanOrEqual(3600)
  })

  it('returns 0 for expired or malformed tokens', () => {
    expect(
      getTokenRemainingSeconds(makeToken({ ...validPayload, exp: pastExp }))
    ).toBe(0)
    expect(getTokenRemainingSeconds('garbage')).toBe(0)
  })
})
