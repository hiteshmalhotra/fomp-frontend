import { Row, Col, Skeleton } from 'antd'
import StatCard from './StatCard'
import type { StatCardData } from '../type/dashboard.types'

interface Props {
  data?: StatCardData[]
  loading: boolean
}

const StatCardGrid = ({ data, loading }: Props) => {
  if (loading) {
    return (
      <Row gutter={16}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <Row gutter={16}>
      {data?.map((card) => (
        <Col xs={24} sm={12} lg={6} key={card.id}>
          <StatCard data={card} />
        </Col>
      ))}
    </Row>
  )
}

export default StatCardGrid