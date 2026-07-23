import { Card, Table, Tag, Input, Select, Button, Typography, Space, Empty, Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { downloadCsv } from '@/utils/csv'
import { getStockStatus } from '@/types/store.types'
import type { StockRow } from '@/types/store.types'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import LocationSelect from '../_shared/components/LocationSelect'
import { STOCK_STATUS_COLORS } from '../_shared/store.constants'
import { useStockSearch } from './hooks/useStockSearch'

const { Title } = Typography

const StockViewPage = () => {
  usePageTitle('Current Stock')
  const { locations, locationsLoading, locationId, setLocationId } =
    useStoreLocations()
  const {
    query,
    categories,
    searchTerm,
    categoryId,
    page,
    size,
    setSearchTerm,
    setCategoryId,
    setPage,
    setSize,
  } = useStockSearch(locationId)

  const rows = query.data?.content ?? []

  const handleExport = () => {
    // Exports the currently loaded page with active filters applied
    downloadCsv(
      `stock-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        'Item Code',
        'Item Name',
        'Unit',
        'Quantity',
        'Reorder Level',
        'Max Level',
        'Status',
        'Avg Price',
        'Stock Value',
        'Last Updated',
      ],
      rows.map((r) => [
        r.itemCode,
        r.itemName,
        r.unitName,
        r.quantity,
        r.reorderLevel,
        r.maxStockLevel,
        getStockStatus(r),
        r.averagePrice,
        r.stockValue,
        r.lastUpdatedAt ? formatDateTime(r.lastUpdatedAt) : '',
      ])
    )
  }

  const columns: ColumnsType<StockRow> = [
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode' },
    { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
    { title: 'Unit', dataIndex: 'unitName', key: 'unitName' },
    {
      title: 'Current Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorderLevel',
      key: 'reorderLevel',
      align: 'right',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, row) => {
        const status = getStockStatus(row)
        return <Tag color={STOCK_STATUS_COLORS[status]}>{status}</Tag>
      },
    },
    {
      title: 'Avg Price',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      align: 'right',
      render: (val: number | null) => (val != null ? formatCurrency(val) : '—'),
    },
    {
      title: 'Stock Value',
      dataIndex: 'stockValue',
      key: 'stockValue',
      align: 'right',
      render: (val: number | null) => (val != null ? formatCurrency(val) : '—'),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdatedAt',
      key: 'lastUpdatedAt',
      render: (val: string | null) => (val ? formatDateTime(val) : '—'),
    },
  ]

  return (
    <div>
      <Title level={1} style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Current Stock
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
            placeholder="All Categories"
            value={categoryId}
            onChange={setCategoryId}
            loading={categories.isLoading}
            style={{ minWidth: 180 }}
            aria-label="Filter by category"
            options={(categories.data ?? [])
              .filter((c) => c.active)
              .map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input
            placeholder="Search by item name or code..."
            prefix={<SearchOutlined style={{ color: '#64748b' }} aria-hidden="true" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 260 }}
            aria-label="Search stock by item name or code"
          />
          <Space style={{ marginLeft: 'auto' }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={rows.length === 0}
            >
              Export CSV
            </Button>
          </Space>
        </div>

        {/* Table */}
        {query.isError ? (
          <Alert
            type="error"
            showIcon
            message="Could not load stock"
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
            scroll={{ x: 900 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    searchTerm || categoryId != null
                      ? 'No stock matches your filters'
                      : 'No stock records found for this location.'
                  }
                />
              ),
            }}
            pagination={{
              current: page + 1,
              pageSize: size,
              total: query.data?.totalElements ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (total) => `${total} items`,
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

export default StockViewPage
