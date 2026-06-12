import { Result, Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROLE_HOME_ROUTES } from '@/utils/constants'

const UnauthorizedPage = () => {
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
        background: '#0D1B2A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="403"
        title={
          <span style={{ color: '#FFFFFF' }}>Access Denied</span>
        }
        subTitle={
          <span style={{ color: '#8AB0AD' }}>
            You do not have permission to view this page.
          </span>
        }
        extra={
          <Space>
            <Button
              type="primary"
              onClick={handleGoHome}
              style={{
                background: '#1A7A6E',
                borderColor: '#1A7A6E',
              }}
            >
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