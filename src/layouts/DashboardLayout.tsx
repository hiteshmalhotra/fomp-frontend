import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import AppSidebar from './components/AppSidebar'
import AppHeader from './components/AppHeader'
import AppBreadcrumb from './components/AppBreadcrumb'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSessionExpiryWarning } from '@/hooks/useSessionExpiryWarning'
import styles from './DashboardLayout.module.css'

const { Content } = Layout

const DashboardLayout = () => {
  useSessionExpiryWarning()
  const isMobile = useMediaQuery('(max-width: 991px)')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(true)
    } else {
      setCollapsed(!collapsed)
    }
  }

  return (
    <Layout className={styles.root}>
      <AppSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Layout
        className={styles.main}
        style={{ marginLeft: isMobile ? 0 : collapsed ? 64 : 240 }}
      >
        <AppHeader
          collapsed={isMobile ? true : collapsed}
          onToggle={handleToggle}
        />

        <Content className={styles.content}>
          <AppBreadcrumb />
          <main id="main-content">
            <Outlet />
          </main>
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout
