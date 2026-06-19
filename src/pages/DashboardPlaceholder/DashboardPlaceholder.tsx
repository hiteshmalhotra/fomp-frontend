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
    <Result
      status="success"
      title={`Welcome, ${user?.firstName} — ${role} Dashboard`}
      subTitle="This section is under construction. Check back soon."
      extra={
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      }
    />
  )
}

export default DashboardPlaceholder