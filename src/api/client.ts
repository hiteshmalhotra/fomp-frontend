import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { isTokenExpired } from '@/utils/jwt'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const { token, clearAuth } = useAuthStore.getState()

    if (token) {
      if (isTokenExpired(token)) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('Token expired'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status    = error.response?.status
    const errorCode = error.response?.data?.error

    if (status === 401) {
      const url = error.config?.url || ''
      if (!url.includes('/api/auth/')) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    if (status === 403) {
      const url = error.config?.url || ''
      if (!url.includes('/api/auth/')) {
        window.location.href = '/unauthorized'
      }
      return Promise.reject(error)
    }

    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after']
      error.retryAfter = retryAfter ? parseInt(retryAfter, 10) : 60
    }

    const correlationId = error.response?.headers?.['x-correlation-id']
    if (correlationId) {
      console.error(`[FOMP] Correlation ID: ${correlationId} | Code: ${errorCode}`)
    }

    return Promise.reject(error)
  }
)

export default apiClient