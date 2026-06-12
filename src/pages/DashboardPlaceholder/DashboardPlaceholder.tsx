import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

interface Props {
  role: string
}

const DashboardPlaceholder = ({ role }: Props) => {
  const navigate = useNavigate()
  const { clearAuth, user } = useAuthStore()

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
        status="success"
        title={
          <span style={{ color: '#FFFFFF' }}>
            Welcome, {user?.firstName} — {role} Dashboard
          </span>
        }
        subTitle={
          <span style={{ color: '#8AB0AD' }}>
            This section is under construction. Check back soon.
          </span>
        }
        extra={
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        }
      />
    </div>
  )
}

export default DashboardPlaceholder