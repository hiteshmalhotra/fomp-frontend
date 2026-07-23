import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardRoute } from '@/utils/roleRedirect'

interface Props {
  children: React.ReactNode
}

/**
 * Inverse of PrivateRoute — authenticated users have no business
 * on /login or /register; send them to their role dashboard.
 */
const GuestRoute = ({ children }: Props) => {
  const { isAuthenticated, role } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to={getDashboardRoute(role)} replace />
  }

  return <>{children}</>
}

export default GuestRoute
