import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Drawer } from 'antd'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/store/auth.store'
import Logo from '@/components/common/Logo'
import { MENU_CONFIG } from '../sidebar/menuConfig'
import { buildMenuForRole, findSelectedKeys, findOpenKeys } from '../sidebar/menuUtils'
import styles from './AppSidebar.module.css'

const { Sider } = Layout

interface Props {
  collapsed: boolean
  onCollapse: (val: boolean) => void
  /** Below the lg breakpoint the sidebar renders as a Drawer. */
  isMobile: boolean
  mobileOpen: boolean
  onMobileClose: () => void
}

/**
 * S: Sidebar only — renders logo + role-filtered menu.
 * D: Depends on menuConfig abstraction, not hardcoded items.
 * Desktop: fixed Sider. Mobile (<992px): Drawer.
 */
const AppSidebar = ({
  collapsed,
  onCollapse,
  isMobile,
  mobileOpen,
  onMobileClose,
}: Props) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { role, user } = useAuthStore()

  const menuItems: MenuProps['items'] = buildMenuForRole(
    MENU_CONFIG,
    role
  ) as MenuProps['items']
  const selectedKeys = findSelectedKeys(MENU_CONFIG, pathname)

  // Open keys are DERIVED from the route, adjusted by explicit user
  // opens/closes — no effect, no cascading renders (lint: set-state-in-effect).
  const derivedOpenKeys = useMemo(
    () => findOpenKeys(MENU_CONFIG, pathname),
    [pathname]
  )
  const [userOpened, setUserOpened] = useState<string[]>([])
  const [userClosed, setUserClosed] = useState<string[]>([])

  const openKeys = useMemo(() => {
    const keys = new Set([...derivedOpenKeys, ...userOpened])
    userClosed.forEach((k) => keys.delete(k))
    return Array.from(keys)
  }, [derivedOpenKeys, userOpened, userClosed])

  const handleOpenChange = (keys: string[]) => {
    setUserOpened(keys.filter((k) => !derivedOpenKeys.includes(k)))
    setUserClosed(derivedOpenKeys.filter((k) => !keys.includes(k)))
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    // Navigating resets manual overrides so the new section opens naturally
    setUserOpened([])
    setUserClosed([])
    navigate(key)
    if (isMobile) onMobileClose()
  }

  const content = (
    <>
      {/* Logo */}
      <div className={styles.logo}>
        <Logo size={32} />
        {(isMobile || !collapsed) && (
          <span className={styles.logoText}>FOMP</span>
        )}
      </div>

      {/* Role-filtered nav */}
      <nav className={styles.menuWrap} aria-label="Main navigation">
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={!isMobile && collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </nav>

      {/* Bottom user card */}
      {user && (
        <div className={styles.userCard}>
          <div className={styles.userAvatar} aria-hidden="true">
            {user.firstName.charAt(0)}
          </div>
          {(isMobile || !collapsed) && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user.firstName} {user.lastName}
              </span>
              <span className={styles.userRole}>
                {role?.replace('ROLE_', '').replace(/_/g, ' ')}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  )

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={onMobileClose}
        width={260}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
        closable={false}
        aria-label="Navigation menu"
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={240}
      collapsedWidth={64}
      className={styles.sider}
    >
      {content}
    </Sider>
  )
}

export default AppSidebar
