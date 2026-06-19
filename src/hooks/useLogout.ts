import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { logout as logoutApi } from '@/api/auth.api'

export const useLogout = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // Backend might be down — still clear local state
    } finally {
      clearAuth()
      navigate('/login', { replace: true })
    }
  }

  return { logout }
}