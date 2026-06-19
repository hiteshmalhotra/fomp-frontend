import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import AppSidebar from './components/AppSidebar'
import AppHeader from './components/AppHeader'
import AppBreadcrumb from './components/AppBreadcrumb'
import styles from './DashboardLayout.module.css'

const { Content } = Layout

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className={styles.root}>
      <AppSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />

      <Layout
        className={styles.main}
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <AppHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <Content className={styles.content}>
          <AppBreadcrumb />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout