import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardRoute } from '@/utils/roleRedirect'
import { usePageTitle } from '@/hooks/usePageTitle'

const NotFoundPage = () => {
  usePageTitle('Page Not Found')
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()

  const homePath = isAuthenticated ? getDashboardRoute(role) : '/login'
  const homeLabel = isAuthenticated ? 'Go to My Dashboard' : 'Go to Sign In'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }}
    >
      <Result
        status="404"
        title="Page not found"
        subTitle="The page you are looking for does not exist or may have moved."
        extra={
          <Button type="primary" onClick={() => navigate(homePath)}>
            {homeLabel}
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
