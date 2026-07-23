import { Row, Col, Skeleton, Alert, Button } from 'antd'
import StatCard from './StatCard'
import type { StatCardData } from '../types/dashboard.types'

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
          <StatCard data={card} />
        </Col>
      ))}
    </Row>
  )
}

export default StatCardGrid
