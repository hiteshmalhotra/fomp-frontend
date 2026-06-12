import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

interface Props {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  return <>{children}</>
}

export default PrivateRoute