import { Result, Button } from 'antd'
import { useRouteError, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardRoute } from '@/utils/roleRedirect'

/**
 * errorElement for the router — catches loader/render errors inside
 * route boundaries so a broken page never white-screens the app.
 */
const RouteError = () => {
  const error = useRouteError()
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()

  if (import.meta.env.DEV) {
    console.error('[FOMP] Route error:', error)
  }

  const homePath = isAuthenticated ? getDashboardRoute(role) : '/login'

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="error"
        title="This page failed to load"
        subTitle="An unexpected error occurred while rendering this page."
        extra={[
          <Button key="home" type="primary" onClick={() => navigate(homePath)}>
            Go to Dashboard
          </Button>,
          <Button key="reload" onClick={() => window.location.reload()}>
            Reload
          </Button>,
        ]}
      />
    </div>
  )
}

export default RouteError
