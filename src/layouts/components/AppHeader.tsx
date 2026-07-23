import { Layout, Button, Dropdown, Avatar, Typography, Tag } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  FontSizeOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { usePreferencesStore } from '@/store/preferences.store'
import { useLogout } from '@/hooks/useLogout'
import { getRoleLabel, getRoleBadgeColor } from '@/utils/roleRedirect'
import styles from './AppHeader.module.css'

const { Header } = Layout
const { Text } = Typography

interface Props {
  collapsed: boolean
  onToggle: () => void
}

/**
 * S: Header only — search, notifications, user dropdown.
 * I: Receives only collapsed state and toggle callback.
 */
const AppHeader = ({ collapsed, onToggle }: Props) => {
  const navigate = useNavigate()
  const { user, role } = useAuthStore()
  const { textScale, setTextScale } = usePreferencesStore()
  const { logout } = useLogout()

  const largeText = textScale === 'large'

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
      onClick: () => navigate('/notifications'),
    },
    { type: 'divider' as const },
    {
      key: 'text-size',
      icon: <FontSizeOutlined />,
      label: (
        <span>
          Larger text{' '}
          {largeText && <CheckOutlined aria-hidden="true" style={{ fontSize: 12 }} />}
        </span>
      ),
      onClick: () => setTextScale(largeText ? 'default' : 'large'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: logout,
    },
  ]

  return (
    <Header className={styles.header}>
      <div className={styles.left}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className={styles.collapseBtn}
          aria-label={collapsed ? 'Open navigation menu' : 'Collapse navigation menu'}
        />
        {/* Global search intentionally absent — a working command palette
            is planned (Phase 3); a dead search box ships nothing. */}
      </div>

      <div className={styles.right}>
        <Button
          type="text"
          icon={<BellOutlined />}
          className={styles.iconBtn}
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        />

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <button
            type="button"
            className={styles.userBlock}
            aria-label={`Account menu for ${user?.firstName ?? 'user'} ${user?.lastName ?? ''}`}
          >
            <Avatar
              size={34}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.userMeta}>
              <Text className={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Tag
                color={getRoleBadgeColor(role)}
                className={styles.roleTag}
              >
                {getRoleLabel(role)}
              </Tag>
            </div>
          </button>
        </Dropdown>
      </div>
    </Header>
  )
}

export default AppHeader
