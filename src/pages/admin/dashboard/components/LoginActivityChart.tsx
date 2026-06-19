import { Card, Typography } from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { LoginActivityPoint } from '../type/dashboard.types'
import styles from './BottomPanels.module.css'

const { Title } = Typography

interface Props {
  data?: LoginActivityPoint[]
  loading: boolean
}

const LoginActivityChart = ({ data, loading }: Props) => {
  return (
    <Card className={styles.card} bordered loading={loading}>
      <Title level={5} className={styles.title}>
        Login Activity (Last 7 Days)
      </Title>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1e40af"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default LoginActivityChart