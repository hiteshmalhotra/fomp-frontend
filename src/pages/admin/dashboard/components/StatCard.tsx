import { Card, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import {
  TeamOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { StatCardData } from '../type/dashboard.types'
import styles from './StatCard.module.css'

const { Text, Title } = Typography

const ICON_MAP: Record<string, React.ReactNode> = {
  users: <TeamOutlined />,
  activity: <ThunderboltOutlined />,
  server: <DatabaseOutlined />,
  clipboard: <FileTextOutlined />,
}

interface Props {
  data: StatCardData
}

const StatCard = ({ data }: Props) => {
  const isUp = data.trend === 'up'

  return (
    <Card className={styles.card} bordered>
      <div className={styles.topRow}>
        <div
          className={styles.iconWrap}
          style={{ background: data.iconBg }}
        >
          {ICON_MAP[data.icon]}
        </div>
        <span className={isUp ? styles.trendUp : styles.trendDown}>
          {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </span>
      </div>
      <Text className={styles.label}>{data.label}</Text>
      <Title level={3} className={styles.value}>
        {data.value}
      </Title>
      <Text className={isUp ? styles.changeUp : styles.changeDown}>
        {data.change}
      </Text>
    </Card>
  )
}

export default StatCard