import { Row, Col, Typography } from 'antd'
import StatCardGrid from './components/StatCardGrid'
import UserManagementTable from './components/UserManagementTable'
import SystemHealthPanel from './components/SystemHealthPanel'
import { useAdminDashboard } from './hooks/useAdminDashboard'
import { usePageTitle } from '@/hooks/usePageTitle'

const { Title } = Typography

const AdminDashboardPage = () => {
  usePageTitle('Admin Dashboard')
  const { statCards, serviceHealth } = useAdminDashboard()

  return (
    <div>
      {/* Page heading — every page needs an h1 for structure/screen readers */}
      <Title
        level={1}
        style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}
      >
        Admin Dashboard
      </Title>

      {/* Layer 1 — KPI cards (real user counts) */}
      <StatCardGrid
        data={statCards.data}
        loading={statCards.isLoading}
        error={statCards.isError}
        onRetry={() => statCards.refetch()}
      />

      {/* Layer 2 — User management table (server-driven) */}
      <UserManagementTable />

      {/* Layer 3 — System health */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <SystemHealthPanel
            data={serviceHealth.data}
            loading={serviceHealth.isLoading}
          />
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboardPage
