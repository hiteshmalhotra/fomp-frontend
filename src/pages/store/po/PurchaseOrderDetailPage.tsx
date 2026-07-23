import {
  Card,
  Descriptions,
  Tag,
  Table,
  Button,
  Typography,
  Skeleton,
  Alert,
  Space,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatDate } from '@/utils/format'
import type { POLineItem } from '@/types/store.types'
import { ROUTE_PATHS } from '@/router/paths'
import { PO_STATUS_COLORS, STATUS_LABELS } from '../_shared/store.constants'
import { usePurchaseOrderDetail } from './hooks/usePurchaseOrderDetail'
import GoodsReceiptForm from './components/GoodsReceiptForm'

const { Title, Text } = Typography

const PurchaseOrderDetailPage = () => {
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const poId = Number(id)
  usePageTitle('Purchase Order')

  const { query, receive, cancel } = usePurchaseOrderDetail(poId)
  const po = query.data

  const receivable =
    po?.status === 'SENT' || po?.status === 'PARTIALLY_RECEIVED'
  const cancellable = po?.status === 'DRAFT' || po?.status === 'SENT'

  const handleCancel = () => {
    modal.confirm({
      title: 'Cancel this purchase order?',
      icon: <ExclamationCircleFilled />,
      content: `${po?.poNumber} will be cancelled. This cannot be undone.`,
      okText: 'Cancel PO',
      okType: 'danger',
      cancelText: 'Keep',
      onOk: () => cancel.mutate('Cancelled by user'),
    })
  }

  const lineColumns: ColumnsType<POLineItem> = [
    {
      title: 'Item',
      key: 'item',
      render: (_, l) => `${l.itemName} (${l.itemCode})`,
    },
    {
      title: 'Ordered',
      key: 'ordered',
      align: 'right',
      render: (_, l) => `${l.orderedQuantity} ${l.unitName}`,
    },
    {
      title: 'Received',
      dataIndex: 'receivedQuantity',
      key: 'received',
      align: 'right',
    },
    {
      title: 'Pending',
      dataIndex: 'pendingQuantity',
      key: 'pending',
      align: 'right',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Line Total',
      dataIndex: 'lineTotal',
      key: 'lineTotal',
      align: 'right',
      render: (v: number) => formatCurrency(v),
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTE_PATHS.storePo)}
          aria-label="Back to purchase orders"
        />
        <Title level={1} style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          {po ? po.poNumber : 'Purchase Order'}
        </Title>
        {po && (
          <Tag color={PO_STATUS_COLORS[po.status]}>
            {STATUS_LABELS[po.status] ?? po.status}
          </Tag>
        )}
      </div>

      {query.isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : query.isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load purchase order"
          action={
            <Button size="small" onClick={() => query.refetch()}>
              Retry
            </Button>
          }
        />
      ) : po ? (
        <>
          {/* Header details */}
          <Card bordered style={{ borderRadius: 12, marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="small">
              <Descriptions.Item label="Supplier">
                {po.supplierName}
              </Descriptions.Item>
              <Descriptions.Item label="PO Date">
                {formatDate(po.poDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Expected Delivery">
                {po.expectedDeliveryDate
                  ? formatDate(po.expectedDeliveryDate)
                  : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Location">
                {po.deliveryLocationName}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                {po.totalAmount != null ? formatCurrency(po.totalAmount) : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Received Amount">
                {po.receivedAmount != null
                  ? formatCurrency(po.receivedAmount)
                  : '—'}
              </Descriptions.Item>
              {po.billNumber && (
                <Descriptions.Item label="Latest Bill">
                  {po.billNumber}
                  {po.billDate && ` · ${formatDate(po.billDate)}`}
                </Descriptions.Item>
              )}
              {po.notes && (
                <Descriptions.Item label="Notes" span={3}>
                  {po.notes}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Line items */}
          <Card
            bordered
            style={{ borderRadius: 12, marginBottom: 16 }}
            title="Line Items"
          >
            <Table
              columns={lineColumns}
              dataSource={po.lineItems}
              rowKey="id"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>

          {/* GRN */}
          {receivable && (
            <Card
              bordered
              style={{ borderRadius: 12, marginBottom: 16 }}
              title="Record Goods Receipt (GRN)"
            >
              <GoodsReceiptForm
                lineItems={po.lineItems}
                submitting={receive.isPending}
                onRecord={(payload) => receive.mutate(payload)}
              />
            </Card>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">
              Created by {po.createdBy} on {formatDate(po.createdAt)}
            </Text>
            <Space>
              {cancellable && (
                <Button danger onClick={handleCancel} loading={cancel.isPending}>
                  Cancel PO
                </Button>
              )}
            </Space>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default PurchaseOrderDetailPage
