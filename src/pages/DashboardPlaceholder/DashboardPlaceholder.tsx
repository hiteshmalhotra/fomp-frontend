import { Result, Button } from 'antd'
import { ToolOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardRoute } from '@/utils/roleRedirect'
import { usePageTitle } from '@/hooks/usePageTitle'

interface Props {
  role: string
}

const DashboardPlaceholder = ({ role }: Props) => {
  usePageTitle(role)
  const navigate = useNavigate()
  const { role: userRole } = useAuthStore()

  return (
    <Result
      icon={<ToolOutlined style={{ color: '#1e40af' }} />}
      title={`${role} — in development`}
      subTitle="This screen has not been built yet. Check back soon."
      extra={
        <Button
          type="primary"
          onClick={() => navigate(getDashboardRoute(userRole))}
        >
          Go to My Dashboard
        </Button>
      }
    />
  )
}

export default DashboardPlaceholder
