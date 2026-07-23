import { Card, Typography, Badge, Empty } from 'antd'
import type { ServiceHealth } from '../types/dashboard.types'
import styles from './BottomPanels.module.css'

const { Title, Text } = Typography

const STATUS_COLOR: Record<ServiceHealth['status'], string> = {
  healthy: '#16a34a',
  degraded: '#d97706',
  down: '#dc2626',
}

const STATUS_LABEL: Record<ServiceHealth['status'], string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
}

interface Props {
  data?: ServiceHealth[]
  loading: boolean
}

const SystemHealthPanel = ({ data, loading }: Props) => {
  return (
    <Card className={styles.card} bordered loading={loading}>
      <Title level={5} className={styles.title}>
        System Health
      </Title>
      {data && data.length > 0 ? (
        <div className={styles.list} role="list">
          {data.map((s) => (
            <div className={styles.row} key={s.name} role="listitem">
              <Text className={styles.rowLabel}>{s.name}</Text>
              <Badge
                color={STATUS_COLOR[s.status]}
                text={
                  <span style={{ color: STATUS_COLOR[s.status], fontSize: 13 }}>
                    {STATUS_LABEL[s.status]}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Health data unavailable"
        />
      )}
    </Card>
  )
}

export default SystemHealthPanel
