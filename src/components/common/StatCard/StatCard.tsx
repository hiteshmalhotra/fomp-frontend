import { Card, Typography } from 'antd'
import type { ReactNode } from 'react'
import styles from './StatCard.module.css'

const { Text, Title } = Typography

export type StatTone = 'blue' | 'green' | 'amber' | 'red'

// Semantic tone → presentation. Data never carries raw colors.
const TONE_BG: Record<StatTone, string> = {
  blue: '#dbeafe',
  green: '#dcfce7',
  amber: '#fef3c7',
  red: '#fee2e2',
}

export interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  tone: StatTone
}

const StatCard = ({ label, value, icon, tone }: StatCardProps) => (
  <Card className={styles.card} bordered>
    <div className={styles.topRow}>
      <div
        className={styles.iconWrap}
        style={{ background: TONE_BG[tone] }}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
    <Text className={styles.label}>{label}</Text>
    <Title level={3} className={styles.value}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Title>
  </Card>
)

export default StatCard
