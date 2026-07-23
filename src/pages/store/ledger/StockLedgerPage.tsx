import { useMemo } from 'react'
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
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatDate } from '@/utils/format'
import { downloadCsv } from '@/utils/csv'
import { LEDGER_TYPE_LABELS } from '@/types/store.types'
import type { LedgerRow, MovementFilter } from '@/types/store.types'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import LocationSelect from '../_shared/components/LocationSelect'
import { MOVEMENT_COLORS } from '../_shared/store.constants'
import { useLedgerSearch } from './hooks/useLedgerSearch'

const { Title } = Typography
const { RangePicker } = DatePicker

// BR-004: exports capped to prevent timeouts
const EXPORT_LIMIT = 1000
// Validation: date range max 1 year per query
const MAX_RANGE_DAYS = 366

const MOVEMENT_OPTIONS: { value: MovementFilter; label: string }[] = [
  { value: 'ALL', label: 'All Movements' },
  { value: 'IN', label: 'IN only' },
  { value: 'OUT', label: 'OUT only' },
]

const StockLedgerPage = () => {
  usePageTitle('Stock Ledger')
  const { message } = App.useApp()
  const { locations, locationsLoading, locationId, setLocationId } =
    useStoreLocations()
  const { query, items, filters, page, size, updateFilters, setPage, setSize } =
    useLedgerSearch(locationId)

  const rows = query.data?.content ?? []
  const total = query.data?.totalElements ?? 0

  const itemOptions = useMemo(
    () =>
      (items.data ?? []).map((i) => ({
        value: i.id,
        label: `${i.name} (${i.itemCode})`,
      })),
    [items.data]
  )

  const handleRangeChange = (range: [Dayjs, Dayjs] | null) => {
    if (!range) {
      updateFilters({ fromDate: undefined, toDate: undefined })
      return
    }
    const [from, to] = range
    if (to.diff(from, 'day') > MAX_RANGE_DAYS) {
      message.warning('Date range cannot exceed one year.')
      return
    }
    updateFilters({
      fromDate: from.format('YYYY-MM-DD'),
      toDate: to.format('YYYY-MM-DD'),
    })
  }

  const handleExport = () => {
    if (total > EXPORT_LIMIT) {
      message.warning(
        `Export is limited to ${EXPORT_LIMIT} records. Narrow your filters first.`
      )
      return
    }
    downloadCsv(
      `ledger-${dayjs().format('YYYY-MM-DD')}.csv`,
      [
        'Date',
        'Reference',
        'Item',
        'Type',
        'Direction',
        'Quantity',
        'Balance After',
        'Unit Price',
        'Value',
        'User',
      ],
      rows.map((r) => [
        formatDate(r.transactionDate),
        r.referenceNumber ?? '',
        `${r.itemName} (${r.itemCode})`,
        LEDGER_TYPE_LABELS[r.type],
        r.movementDirection,
        r.quantity,
        r.balanceAfter,
        r.unitPrice,
        r.totalValue,
        r.createdBy,
      ])
    )
  }

  const columns: ColumnsType<LedgerRow> = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Reference',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      render: (val: string | null) => val ?? '—',
    },
    {
      title: 'Item',
      key: 'item',
      render: (_, r) => `${r.itemName} (${r.itemCode})`,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, r) => LEDGER_TYPE_LABELS[r.type],
    },
    {
      title: 'Movement',
      dataIndex: 'movementDirection',
      key: 'movementDirection',
      render: (_, r) => (
        <Tag color={MOVEMENT_COLORS[r.movementDirection]}>
          {r.movementDirection}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      align: 'right',
      render: (_, r) => `${r.quantity} ${r.unitName}`,
    },
    {
      title: 'Balance After',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      align: 'right',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      render: (val: number | null) => (val != null ? formatCurrency(val) : '—'),
    },
    {
      title: 'Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      align: 'right',
      render: (val: number | null) => (val != null ? formatCurrency(val) : '—'),
    },
    {
      title: 'User',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
  ]

  return (
    <div>
      <Title level={1} style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Stock Ledger
      </Title>

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
          <LocationSelect
            locations={locations}
            loading={locationsLoading}
            value={locationId}
            onChange={setLocationId}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="All Items"
            value={filters.itemId}
            onChange={(value) => updateFilters({ itemId: value })}
            loading={items.isLoading}
            style={{ minWidth: 220 }}
            aria-label="Filter by item"
            options={itemOptions}
          />
          <RangePicker
            onChange={(range) =>
              handleRangeChange(range as [Dayjs, Dayjs] | null)
            }
            disabledDate={(d) => d.isAfter(dayjs(), 'day')}
            aria-label="Filter by date range"
          />
          <Select
            value={filters.type}
            onChange={(value) => updateFilters({ type: value })}
            options={MOVEMENT_OPTIONS}
            style={{ minWidth: 150 }}
            aria-label="Filter by movement type"
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={rows.length === 0}
            style={{ marginLeft: 'auto' }}
          >
            Export CSV
          </Button>
        </div>

        {/* Table */}
        {query.isError ? (
          <Alert
            type="error"
            showIcon
            message="Could not load ledger"
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
            scroll={{ x: 1100 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No ledger entries found for the selected criteria."
                />
              ),
            }}
            pagination={{
              current: page + 1,
              pageSize: size,
              total,
              showSizeChanger: true,
              pageSizeOptions: [20, 50, 100],
              showTotal: (t) => `${t} entries`,
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

export default StockLedgerPage
