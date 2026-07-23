import { Card, Typography } from 'antd'
import {
  TeamOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { StatCardData, StatTone } from '../types/dashboard.types'
import styles from './StatCard.module.css'

const { Text, Title } = Typography

const ICON_MAP: Record<StatCardData['icon'], React.ReactNode> = {
  users: <TeamOutlined />,
  activity: <ThunderboltOutlined />,
  server: <DatabaseOutlined />,
  clipboard: <FileTextOutlined />,
}

// Semantic tone → presentation. Data never carries raw colors.
const TONE_BG: Record<StatTone, string> = {
  blue: '#dbeafe',
  green: '#dcfce7',
  amber: '#fef3c7',
}

interface Props {
  data: StatCardData
}

const StatCard = ({ data }: Props) => (
  <Card className={styles.card} bordered>
    <div className={styles.topRow}>
      <div
        className={styles.iconWrap}
        style={{ background: TONE_BG[data.tone] }}
        aria-hidden="true"
      >
        {ICON_MAP[data.icon]}
      </div>
    </div>
    <Text className={styles.label}>{data.label}</Text>
    <Title level={3} className={styles.value}>
      {typeof data.value === 'number'
        ? data.value.toLocaleString()
        : data.value}
    </Title>
  </Card>
)

export default StatCard
