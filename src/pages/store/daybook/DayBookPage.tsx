import {
  Card,
  Table,
  DatePicker,
  Button,
  Typography,
  Empty,
  Alert,
  Space,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownloadOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate } from '@/utils/format'
import { downloadCsv } from '@/utils/csv'
import type { DayBookLine } from '@/types/store.types'
import { ROUTE_PATHS } from '@/router/paths'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import LocationSelect from '../_shared/components/LocationSelect'
import { useDayBook } from './hooks/useDayBook'

const { Title } = Typography

// Right-aligned numeric column with tabular figures (prevents column jitter)
const qtyCol = (
  title: string,
  key: keyof DayBookLine
): ColumnsType<DayBookLine>[number] => ({
  title,
  dataIndex: key as string,
  key: key as string,
  align: 'right',
  width: 110,
  render: (val: number) => (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{val ?? 0}</span>
  ),
})

const DayBookPage = () => {
  usePageTitle('Day Book')
  const { locations, locationsLoading, locationId, setLocationId } =
    useStoreLocations()
  const { query, date, setDate } = useDayBook(locationId)

  const lines = query.data?.lines ?? []

  const handleExport = () => {
    downloadCsv(
      `daybook-${date.format('YYYY-MM-DD')}.csv`,
      [
        'Item Code',
        'Item',
        'Unit',
        'Opening',
        'PO Receipt',
        'Transfer In',
        'Return',
        'Transfer Out',
        'Prod. Consumption',
        'Prod. Receipt',
        'Adjustment In',
        'Adjustment Out (incl. wastage)',
        'Closing',
      ],
      lines.map((l) => [
        l.itemCode,
        l.itemName,
        l.unitName,
        l.openingQty,
        l.poReceiptQty,
        l.transferInQty,
        l.returnQty,
        l.transferOutQty,
        l.productionConsumptionQty,
        l.productionReceiptQty,
        l.adjustmentInQty,
        l.adjustmentOutQty,
        l.closingQty,
      ])
    )
  }

  const columns: ColumnsType<DayBookLine> = [
    {
      title: 'Item',
      key: 'item',
      fixed: 'left',
      width: 200,
      render: (_, l) => (
        <span>
          {l.itemName}{' '}
          <Typography.Text type="secondary">({l.itemCode})</Typography.Text>
        </span>
      ),
    },
    { title: 'Unit', dataIndex: 'unitName', key: 'unitName', width: 80 },
    qtyCol('Opening', 'openingQty'),
    qtyCol('PO Receipt', 'poReceiptQty'),
    qtyCol('Transfer In', 'transferInQty'),
    qtyCol('Return', 'returnQty'),
    qtyCol('Transfer Out', 'transferOutQty'),
    qtyCol('Prod. Consumption', 'productionConsumptionQty'),
    qtyCol('Prod. Receipt', 'productionReceiptQty'),
    qtyCol('Adjustment In', 'adjustmentInQty'),
    qtyCol('Adjustment Out', 'adjustmentOutQty'),
    {
      ...qtyCol('Closing', 'closingQty'),
      render: (val: number) => (
        <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
          {val ?? 0}
        </strong>
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
          Day Book
          {query.data && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: 14, fontWeight: 400, marginLeft: 12 }}
            >
              {formatDate(date.format('YYYY-MM-DD'))}
            </Typography.Text>
          )}
        </Title>
        <Link to={ROUTE_PATHS.storeStock}>View Consolidated Stock →</Link>
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
          <LocationSelect
            locations={locations}
            loading={locationsLoading}
            value={locationId}
            onChange={setLocationId}
          />
          <DatePicker
            value={date}
            onChange={(d) => d && setDate(d)}
            allowClear={false}
            disabledDate={(d) => d.isAfter(dayjs(), 'day')} // no future dates
            aria-label="Day Book date"
          />
          <Space style={{ marginLeft: 'auto' }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={lines.length === 0}
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
            message="Could not load Day Book"
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
            dataSource={lines}
            rowKey="itemId"
            loading={query.isLoading || query.isFetching}
            scroll={{ x: 1300 }}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No stock movements recorded for this date and location."
                />
              ),
            }}
          />
        )}
      </Card>
    </div>
  )
}

export default DayBookPage
