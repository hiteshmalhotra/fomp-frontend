import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/store/auth.store'
import { MENU_CONFIG } from '../sidebar/menuConfig'
import { buildMenuForRole, findSelectedKeys, findOpenKeys } from '../sidebar/menuUtils'
import styles from './AppSidebar.module.css'

const { Sider } = Layout

interface Props {
  collapsed: boolean
  onCollapse: (val: boolean) => void
}

/**
 * S: Sidebar only — renders logo + role-filtered menu.
 * D: Depends on menuConfig abstraction, not hardcoded items.
 */
const AppSidebar = ({ collapsed, onCollapse }: Props) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { role, user } = useAuthStore()

  const menuItems: MenuProps['items'] = buildMenuForRole(
    MENU_CONFIG,
    role
  ) as MenuProps['items']
  const selectedKeys = findSelectedKeys(MENU_CONFIG, pathname)

  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    findOpenKeys(MENU_CONFIG, pathname)
  )

  // Update open keys when route changes (e.g. via breadcrumb click)
  useEffect(() => {
    if (!collapsed) {
      setOpenKeys(findOpenKeys(MENU_CONFIG, pathname))
    }
  }, [pathname, collapsed])

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
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
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍽</span>
        {!collapsed && <span className={styles.logoText}>FOMP</span>}
      </div>

      {/* Role-filtered nav */}
      <div className={styles.menuWrap}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </div>

      {/* Bottom user card */}
      {user && (
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            {user.firstName.charAt(0)}
          </div>
          {!collapsed && (
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
    </Sider>
  )
}

export default AppSidebar