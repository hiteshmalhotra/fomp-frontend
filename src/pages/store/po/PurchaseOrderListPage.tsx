import {
  Card,
  Table,
  Tag,
  Select,
  DatePicker,
  Button,
  Typography,
  Empty,
  Alert,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatDate } from '@/utils/format'
import type { PurchaseOrder, POStatus, POStatusFilter } from '@/types/store.types'
import { ROUTE_PATHS, storePoDetail } from '@/router/paths'
import { PO_STATUS_COLORS, STATUS_LABELS } from '../_shared/store.constants'
import { usePurchaseOrders } from './hooks/usePurchaseOrders'

const { Title } = Typography
const { RangePicker } = DatePicker

const STATUS_OPTIONS: { value: POStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'PARTIALLY_RECEIVED', label: 'Partially Received' },
  { value: 'FULLY_RECEIVED', label: 'Fully Received' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const PurchaseOrderListPage = () => {
  usePageTitle('Purchase Orders')
  const navigate = useNavigate()
  const {
    query,
    suppliers,
    status,
    supplierId,
    page,
    size,
    setStatus,
    setSupplierId,
    setDateRange,
    setPage,
    setSize,
  } = usePurchaseOrders()

  const rows = query.data?.content ?? []

  const handleRange = (range: [Dayjs, Dayjs] | null) => {
    if (!range) {
      setDateRange(undefined, undefined)
      return
    }
    setDateRange(range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD'))
  }

  const columns: ColumnsType<PurchaseOrder> = [
    { title: 'PO Number', dataIndex: 'poNumber', key: 'poNumber' },
    { title: 'Supplier', dataIndex: 'supplierName', key: 'supplierName' },
    {
      title: 'Created',
      dataIndex: 'poDate',
      key: 'poDate',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (val: string | null) => (val ? formatDate(val) : '—'),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      render: (val: number | null) => (val != null ? formatCurrency(val) : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: POStatus) => (
        <Tag color={PO_STATUS_COLORS[s]}>{STATUS_LABELS[s] ?? s}</Tag>
      ),
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Title level={1} style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Purchase Orders
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTE_PATHS.storePoCreate)}
        >
          Create PO
        </Button>
      </div>

      <Card bordered style={{ borderRadius: 12 }}>
        {/* Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Select
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            style={{ minWidth: 180 }}
            aria-label="Filter by status"
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="All Suppliers"
            value={supplierId}
            onChange={setSupplierId}
            loading={suppliers.isLoading}
            style={{ minWidth: 200 }}
            aria-label="Filter by supplier"
            options={(suppliers.data ?? [])
              .filter((s) => s.active)
              .map((s) => ({
                value: s.id,
                label: `${s.name} (${s.supplierCode})`,
              }))}
          />
          <RangePicker
            onChange={(range) => handleRange(range as [Dayjs, Dayjs] | null)}
            disabledDate={(d) => d.isAfter(dayjs(), 'day')}
            aria-label="Filter by date range"
          />
        </div>

        {/* Table */}
        {query.isError ? (
          <Alert
            type="error"
            showIcon
            message="Could not load purchase orders"
            description="The store service did not respond."
            action={
              <Button size="small" onClick={() => query.refetch()}>
                Retry
              </Button>
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={rows}
            rowKey="id"
            loading={query.isLoading || query.isFetching}
            scroll={{ x: 800 }}
            onRow={(record) => ({
              onClick: () => navigate(storePoDetail(record.id)),
              style: { cursor: 'pointer' },
            })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No purchase orders match your filters."
                />
              ),
            }}
            pagination={{
              current: page + 1,
              pageSize: size,
              total: query.data?.totalElements ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (t) => `${t} orders`,
              onChange: (p, s) => {
                setPage(p - 1)
                setSize(s)
              },
            }}
          />
        )}
      </Card>
    </div>
  )
}

export default PurchaseOrderListPage
