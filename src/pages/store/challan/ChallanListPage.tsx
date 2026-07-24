import {
  Card,
  Table,
  Tag,
  Select,
  DatePicker,
  Button,
  Typography,
  Tabs,
  Empty,
  Alert,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate } from '@/utils/format'
import type {
  TransferChallan,
  ChallanStatus,
  ChallanStatusFilter,
} from '@/types/store.types'
import { ROUTE_PATHS, storeChallanDetail } from '@/router/paths'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import LocationSelect from '../_shared/components/LocationSelect'
import { CHALLAN_STATUS_COLORS, STATUS_LABELS } from '../_shared/store.constants'
import { useChallans } from './hooks/useChallans'

const { Title } = Typography
const { RangePicker } = DatePicker

const STATUS_OPTIONS: { value: ChallanStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PACKING', label: 'Packing' },
  { value: 'DISPATCHED', label: 'Dispatched' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const ChallanListPage = () => {
  usePageTitle('Transfer Challans')
  const navigate = useNavigate()
  const { locations, locationsLoading, locationId, setLocationId } =
    useStoreLocations()
  const {
    query,
    direction,
    status,
    page,
    size,
    setDirection,
    setStatus,
    setDateRange,
    setPage,
    setSize,
  } = useChallans(locationId)

  const rows = query.data?.content ?? []

  const handleRange = (range: [Dayjs, Dayjs] | null) => {
    if (!range) {
      setDateRange(undefined, undefined)
      return
    }
    setDateRange(range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD'))
  }

  const columns: ColumnsType<TransferChallan> = [
    { title: 'Challan #', dataIndex: 'challanNumber', key: 'challanNumber' },
    { title: 'Source', dataIndex: 'fromLocationName', key: 'fromLocationName' },
    { title: 'Destination', dataIndex: 'toLocationName', key: 'toLocationName' },
    {
      title: 'Created',
      dataIndex: 'challanDate',
      key: 'challanDate',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: ChallanStatus, record) => (
        <>
          <Tag color={CHALLAN_STATUS_COLORS[s]}>{STATUS_LABELS[s] ?? s}</Tag>
          {record.hasShortage && <Tag color="red">Shortage</Tag>}
        </>
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
          Transfer Challans
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTE_PATHS.storeChallanCreate)}
        >
          Create Challan
        </Button>
      </div>

      <Card bordered style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={direction}
          onChange={(k) => setDirection(k as 'OUTGOING' | 'INCOMING')}
          items={[
            { key: 'OUTGOING', label: 'Outgoing Challans' },
            { key: 'INCOMING', label: 'Incoming Challans' },
          ]}
        />

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
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            style={{ minWidth: 170 }}
            aria-label="Filter by status"
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
            message="Could not load challans"
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
              onClick: () => navigate(storeChallanDetail(record.id)),
              style: { cursor: 'pointer' },
            })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={`No ${direction.toLowerCase()} challans found.`}
                />
              ),
            }}
            pagination={{
              current: page + 1,
              pageSize: size,
              total: query.data?.totalElements ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (t) => `${t} challans`,
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

export default ChallanListPage
