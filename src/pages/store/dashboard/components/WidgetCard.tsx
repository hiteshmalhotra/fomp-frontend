import { Card, Typography, Alert, Button, Empty } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const { Title } = Typography

interface Props {
  title: string
  loading: boolean
  error: boolean
  onRetry: () => void
  empty: boolean
  emptyText: string
  viewAllTo?: string
  children: ReactNode
}

/**
 * Dashboard widget shell — per-widget loading/error/empty states
 * (STORE-001: one widget failing must not take down the others).
 */
const WidgetCard = ({
  title,
  loading,
  error,
  onRetry,
  empty,
  emptyText,
  viewAllTo,
  children,
}: Props) => (
  <Card
    bordered
    loading={loading}
    style={{ borderRadius: 12, height: '100%' }}
    title={
      <Title level={5} style={{ margin: 0 }}>
        {title}
      </Title>
    }
    extra={viewAllTo && <Link to={viewAllTo}>View all</Link>}
  >
    {error ? (
      <Alert
        type="error"
        showIcon
        message={`Could not load ${title.toLowerCase()}`}
        action={
          <Button size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      />
    ) : empty ? (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
    ) : (
      children
    )}
  </Card>
)

export default WidgetCard
