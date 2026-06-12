import { create } from 'zustand'
import type { User, UserRole } from '@/types/auth.types'

interface AuthState {
  token: string | null
  user: User | null
  role: UserRole | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  role: null,
  isAuthenticated: false,
  setAuth: (token, user) =>
    set({ token, user, role: user.role, isAuthenticated: true }),
  clearAuth: () =>
    set({ token: null, user: null, role: null, isAuthenticated: false }),
}))