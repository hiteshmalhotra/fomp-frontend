import { Row, Col, Typography, Button, Skeleton, Alert } from 'antd'
import {
  DatabaseOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import StatCard from '@/components/common/StatCard'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import LocationSelect from '../_shared/components/LocationSelect'
import { useStoreDashboard } from './hooks/useStoreDashboard'
import LowStockWidget from './components/LowStockWidget'
import RecentPOsWidget from './components/RecentPOsWidget'
import RecentChallansWidget from './components/RecentChallansWidget'

const { Title } = Typography

const StoreDashboardPage = () => {
  usePageTitle('Store Dashboard')
  const queryClient = useQueryClient()
  const { locations, locationsLoading, locationId, setLocationId } =
    useStoreLocations()
  const { summary, lowStock, recentPOs, recentChallans } =
    useStoreDashboard(locationId)

  // Spec BR-002: dashboard refreshes on load; manual refresh available
  const refreshAll = () =>
    queryClient.invalidateQueries({ queryKey: ['store'] })

  return (
    <div>
      {/* Header row */}
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
          Store Dashboard
        </Title>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <LocationSelect
            locations={locations}
            loading={locationsLoading}
            value={locationId}
            onChange={setLocationId}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshAll}
            aria-label="Refresh dashboard"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      {summary.isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load store statistics"
          action={
            <Button size="small" onClick={() => summary.refetch()}>
              Retry
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      ) : summary.isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Col>
          ))}
        </Row>
      ) : summary.data ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              label="Total Stock Items"
              value={summary.data.totalStockItems}
              icon={<DatabaseOutlined />}
              tone="blue"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              label="Low Stock Items"
              value={summary.data.lowStockCount}
              icon={<WarningOutlined />}
              tone={summary.data.lowStockCount > 0 ? 'red' : 'green'}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              label="Pending POs"
              value={summary.data.pendingPoCount}
              icon={<ShoppingCartOutlined />}
              tone="amber"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              label="Pending Challans"
              value={summary.data.pendingChallanCount}
              icon={<SwapOutlined />}
              tone="amber"
            />
          </Col>
        </Row>
      ) : null}

      {/* Widgets — each loads and fails independently (spec BR) */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <LowStockWidget
            loading={lowStock.isLoading}
            error={lowStock.isError}
            onRetry={() => lowStock.refetch()}
            data={lowStock.data}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RecentPOsWidget
            loading={recentPOs.isLoading}
            error={recentPOs.isError}
            onRetry={() => recentPOs.refetch()}
            data={recentPOs.data?.content}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RecentChallansWidget
            loading={recentChallans.isLoading}
            error={recentChallans.isError}
            onRetry={() => recentChallans.refetch()}
            data={recentChallans.data?.content}
          />
        </Col>
      </Row>
    </div>
  )
}

export default StoreDashboardPage
