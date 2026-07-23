import { List, Tag, Typography } from 'antd'
import type { PurchaseOrder } from '@/types/store.types'
import { formatCurrency, formatDate } from '@/utils/format'
import { PO_STATUS_COLORS, STATUS_LABELS } from '../../_shared/store.constants'
import { ROUTE_PATHS } from '@/router/paths'
import WidgetCard from './WidgetCard'

const { Text } = Typography

interface Props {
  loading: boolean
  error: boolean
  onRetry: () => void
  data?: PurchaseOrder[]
}

const RecentPOsWidget = ({ loading, error, onRetry, data }: Props) => (
  <WidgetCard
    title="Recent Purchase Orders"
    loading={loading}
    error={error}
    onRetry={onRetry}
    empty={!data || data.length === 0}
    emptyText="No purchase orders yet"
    viewAllTo={ROUTE_PATHS.storePo}
  >
    <List
      size="small"
      dataSource={data}
      renderItem={(po) => (
        <List.Item>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong>{po.poNumber}</Text>
            <div>
              <Text type="secondary">
                {po.supplierName} · {formatDate(po.poDate)}
                {po.totalAmount != null &&
                  ` · ${formatCurrency(po.totalAmount)}`}
              </Text>
            </div>
          </div>
          <Tag color={PO_STATUS_COLORS[po.status]}>
            {STATUS_LABELS[po.status] ?? po.status}
          </Tag>
        </List.Item>
      )}
    />
  </WidgetCard>
)

export default RecentPOsWidget
