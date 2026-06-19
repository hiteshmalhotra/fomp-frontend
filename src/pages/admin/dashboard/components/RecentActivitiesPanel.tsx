import { Card, Typography } from 'antd'
import type { ActivityItem } from '../type/dashboard.types'
import { ACTIVITY_ICON_MAP } from '../utils/dashboard.constants.ts'
import styles from './BottomPanels.module.css'

const { Title, Text, Link } = Typography

interface Props {
  data?: ActivityItem[]
  loading: boolean
}

const RecentActivitiesPanel = ({ data, loading }: Props) => {
  return (
    <Card className={styles.card} bordered loading={loading}>
      <div className={styles.headerRow}>
        <Title level={5} className={styles.title}>
          Recent Activities
        </Title>
        <Link className={styles.viewAllLink}>View All</Link>
      </div>
      <div className={styles.activityList}>
        {data?.map((a) => (
          <div className={styles.activityItem} key={a.id}>
            <span className={styles.activityIcon}>
              {ACTIVITY_ICON_MAP[a.icon]}
            </span>
            <div>
              <Text className={styles.activityTitle}>{a.title}</Text>
              <Text className={styles.activityTime}>{a.timestamp}</Text>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RecentActivitiesPanel