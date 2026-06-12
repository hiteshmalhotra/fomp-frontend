import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/types/auth.types'

interface Props {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

const RoleRoute = ({ children, allowedRoles }: Props) => {
  const { role, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export default RoleRoute