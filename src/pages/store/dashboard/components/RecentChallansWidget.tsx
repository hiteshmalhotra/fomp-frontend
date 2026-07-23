import { List, Tag, Typography } from 'antd'
import type { TransferChallan } from '@/types/store.types'
import { formatDate } from '@/utils/format'
import {
  CHALLAN_STATUS_COLORS,
  STATUS_LABELS,
} from '../../_shared/store.constants'
import { ROUTE_PATHS } from '@/router/paths'
import WidgetCard from './WidgetCard'

const { Text } = Typography

interface Props {
  loading: boolean
  error: boolean
  onRetry: () => void
  data?: TransferChallan[]
}

const RecentChallansWidget = ({ loading, error, onRetry, data }: Props) => (
  <WidgetCard
    title="Recent Challans"
    loading={loading}
    error={error}
    onRetry={onRetry}
    empty={!data || data.length === 0}
    emptyText="No transfer challans yet"
    viewAllTo={ROUTE_PATHS.storeChallanUnpacked}
  >
    <List
      size="small"
      dataSource={data}
      renderItem={(challan) => (
        <List.Item>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong>{challan.challanNumber}</Text>
            <div>
              <Text type="secondary">
                {challan.fromLocationName} → {challan.toLocationName} ·{' '}
                {formatDate(challan.challanDate)}
              </Text>
            </div>
          </div>
          <Tag color={CHALLAN_STATUS_COLORS[challan.status]}>
            {STATUS_LABELS[challan.status] ?? challan.status}
          </Tag>
        </List.Item>
      )}
    />
  </WidgetCard>
)

export default RecentChallansWidget
