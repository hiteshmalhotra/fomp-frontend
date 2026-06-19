import { Card, Typography, Badge } from 'antd'
import type { ServiceHealth } from '../type/dashboard.types'
import styles from './BottomPanels.module.css'

const { Title, Text, Link } = Typography

const STATUS_COLOR: Record<ServiceHealth['status'], string> = {
  healthy: '#16a34a',
  degraded: '#d97706',
  down: '#dc2626',
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
      <div className={styles.list}>
        {data?.map((s) => (
          <div className={styles.row} key={s.name}>
            <Text className={styles.rowLabel}>{s.name}</Text>
            <Badge
              color={STATUS_COLOR[s.status]}
              text={
                <span style={{ color: STATUS_COLOR[s.status], fontSize: 13 }}>
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
              }
            />
          </div>
        ))}
      </div>
      <Link className={styles.footerLink}>View all services →</Link>
    </Card>
  )
}

export default SystemHealthPanel