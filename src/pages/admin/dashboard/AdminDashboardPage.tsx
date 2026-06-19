import { Row, Col } from 'antd'
import StatCardGrid from './components/StatCardGrid'
import UserManagementTable from './components/UserManagementTable'
import SystemHealthPanel from './components/SystemHealthPanel'
import LoginActivityChart from './components/LoginActivityChart'
import RecentActivitiesPanel from './components/RecentActivitiesPanel'
import { useAdminDashboard } from './hooks/useAdminDashboard'

const AdminDashboardPage = () => {
  const { statCards, users, serviceHealth, loginActivity, activities } =
    useAdminDashboard()

  return (
    <div>
      {/* Layer 1 — Stat cards */}
      <StatCardGrid data={statCards.data} loading={statCards.isLoading} />

      {/* Layer 2 — User management table */}
      <UserManagementTable data={users.data?.content} loading={users.isLoading} />
      

      {/* Layer 3 — System health / chart / activities */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <SystemHealthPanel
            data={serviceHealth.data}
            loading={serviceHealth.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <LoginActivityChart
            data={loginActivity.data}
            loading={loginActivity.isLoading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RecentActivitiesPanel
            data={activities.data}
            loading={activities.isLoading}
          />
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboardPage