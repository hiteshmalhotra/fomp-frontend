import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { User, UserRole } from '@/types/auth.types'
import { isTokenExpired } from '@/utils/jwt'

interface AuthState {
  token: string | null
  user: User | null
  role: UserRole | null
  isAuthenticated: boolean
  rememberMe: boolean
  setAuth: (token: string, user: User, rememberMe?: boolean) => void
  clearAuth: () => void
}

/**
 * "Remember me" storage routing:
 *  - checked   → localStorage   (session survives browser restart)
 *  - unchecked → sessionStorage (cleared when the tab closes)
 * The flag travels inside the persisted state, so the write side
 * knows where to store; reads check both.
 */
const dualStorage: StateStorage = {
  getItem: (name) =>
    sessionStorage.getItem(name) ?? localStorage.getItem(name),
  setItem: (name, value) => {
    const remember = (() => {
      try {
        return Boolean(
          (JSON.parse(value) as { state?: { rememberMe?: boolean } })?.state
            ?.rememberMe
        )
      } catch {
        return false
      }
    })()
    if (remember) {
      localStorage.setItem(name, value)
      sessionStorage.removeItem(name)
    } else {
      sessionStorage.setItem(name, value)
      localStorage.removeItem(name)
    }
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name)
    localStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
      rememberMe: false,
      setAuth: (token, user, rememberMe = false) =>
        set({ token, user, role: user.role, isAuthenticated: true, rememberMe }),
      clearAuth: () =>
        set({
          token: null,
          user: null,
          role: null,
          isAuthenticated: false,
          rememberMe: false,
        }),
    }),
    {
      name: 'fomp-auth',
      storage: createJSONStorage(() => dualStorage),
      partialize: (state): Partial<AuthState> =>
        state.token
          ? {
              token: state.token,
              user: state.user,
              role: state.role,
              isAuthenticated: state.isAuthenticated,
              rememberMe: state.rememberMe,
            }
          : {},
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.clearAuth()
        }
      },
    }
  )
)
