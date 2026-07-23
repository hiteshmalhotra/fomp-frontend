import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'
import type { User } from '@/types/auth.types'

const user: User = {
  id: 1,
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@company.com',
  role: 'ROLE_ADMIN',
}

const STORAGE_KEY = 'fomp-auth'

describe('auth.store', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    useAuthStore.getState().clearAuth()
  })

  it('setAuth populates state and derives role', () => {
    useAuthStore.getState().setAuth('token-123', user)
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('token-123')
    expect(state.role).toBe('ROLE_ADMIN')
  })

  it('clearAuth resets everything', () => {
    useAuthStore.getState().setAuth('token-123', user)
    useAuthStore.getState().clearAuth()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.role).toBeNull()
  })

  it('rememberMe=true persists to localStorage, not sessionStorage', () => {
    useAuthStore.getState().setAuth('token-123', user, true)
    expect(localStorage.getItem(STORAGE_KEY)).toContain('token-123')
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rememberMe=false persists to sessionStorage, not localStorage', () => {
    useAuthStore.getState().setAuth('token-123', user, false)
    expect(sessionStorage.getItem(STORAGE_KEY)).toContain('token-123')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('clearAuth wipes the persisted token from storage', () => {
    useAuthStore.getState().setAuth('token-123', user, true)
    useAuthStore.getState().clearAuth()
    const local = localStorage.getItem(STORAGE_KEY) ?? ''
    const session = sessionStorage.getItem(STORAGE_KEY) ?? ''
    expect(local).not.toContain('token-123')
    expect(session).not.toContain('token-123')
  })
})
