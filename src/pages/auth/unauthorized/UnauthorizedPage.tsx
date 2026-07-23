import { Result, Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROLE_HOME_ROUTES } from '@/utils/constants'
import { usePageTitle } from '@/hooks/usePageTitle'

const UnauthorizedPage = () => {
  usePageTitle('Access Denied')
  const navigate = useNavigate()
  const { role, clearAuth } = useAuthStore()

  const handleGoHome = () => {
    if (role) {
      navigate(ROLE_HOME_ROUTES[role])
    } else {
      navigate('/login')
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="403"
        title="Access Denied"
        subTitle="You do not have permission to view this page. If you believe this is a mistake, contact your administrator."
        extra={
          <Space>
            <Button type="primary" onClick={handleGoHome}>
              Go to My Dashboard
            </Button>
            <Button danger onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        }
      />
    </div>
  )
}

export default UnauthorizedPage
