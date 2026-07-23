import { Row, Col, Skeleton, Alert, Button } from 'antd'
import {
  TeamOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import StatCard from '@/components/common/StatCard'
import type { StatCardData } from '../types/dashboard.types'

const ICON_MAP: Record<StatCardData['icon'], React.ReactNode> = {
  users: <TeamOutlined />,
  activity: <ThunderboltOutlined />,
  server: <DatabaseOutlined />,
  clipboard: <FileTextOutlined />,
}

interface Props {
  data?: StatCardData[]
  loading: boolean
  error?: boolean
  onRetry?: () => void
}

const StatCardGrid = ({ data, loading, error, onRetry }: Props) => {
  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Col>
        ))}
      </Row>
    )
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Could not load user statistics"
        description="The statistics service did not respond."
        action={
          onRetry && (
            <Button size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      />
    )
  }

  return (
    <Row gutter={[16, 16]}>
      {data?.map((card) => (
        <Col xs={24} sm={12} lg={8} key={card.id}>
          <StatCard
            label={card.label}
            value={card.value}
            icon={ICON_MAP[card.icon]}
            tone={card.tone}
          />
        </Col>
      ))}
    </Row>
  )
}

export default StatCardGrid
