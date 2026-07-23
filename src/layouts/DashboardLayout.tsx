import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import AppSidebar from './components/AppSidebar'
import AppHeader from './components/AppHeader'
import AppBreadcrumb from './components/AppBreadcrumb'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSessionExpiryWarning } from '@/hooks/useSessionExpiryWarning'
import { useFocusMainOnNavigate } from '@/hooks/useFocusMainOnNavigate'
import styles from './DashboardLayout.module.css'

const { Content } = Layout

const DashboardLayout = () => {
  useSessionExpiryWarning()
  useFocusMainOnNavigate()
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
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
          {/* tabIndex -1: programmatically focusable for route-change focus */}
          <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
            <Outlet />
          </main>
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout
