import { List, Tag, Typography } from 'antd'
import { getStockStatus } from '@/types/store.types'
import type { StockRow } from '@/types/store.types'
import { STOCK_STATUS_COLORS } from '../../_shared/store.constants'
import { ROUTE_PATHS } from '@/router/paths'
import WidgetCard from './WidgetCard'

const { Text } = Typography

interface Props {
  loading: boolean
  error: boolean
  onRetry: () => void
  data?: StockRow[]
}

const LowStockWidget = ({ loading, error, onRetry, data }: Props) => (
  <WidgetCard
    title="Low Stock Alerts"
    loading={loading}
    error={error}
    onRetry={onRetry}
    empty={!data || data.length === 0}
    emptyText="No items below reorder level"
    viewAllTo={ROUTE_PATHS.storeStock}
  >
    <List
      size="small"
      dataSource={data?.slice(0, 6)}
      renderItem={(row) => {
        const status = getStockStatus(row)
        return (
          <List.Item>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong>{row.itemName}</Text>{' '}
              <Text type="secondary">({row.itemCode})</Text>
              <div>
                <Text type="secondary">
                  {row.quantity} {row.unitName} / reorder at {row.reorderLevel}
                </Text>
              </div>
            </div>
            <Tag color={STOCK_STATUS_COLORS[status]}>{status}</Tag>
          </List.Item>
        )
      }}
    />
  </WidgetCard>
)

export default LowStockWidget
