import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { isRoutablePath } from '@/router/paths'

/**
 * Auto-generates breadcrumbs from the current URL path.
 * /store/challan/received/packed → Home > Store > Challan > Received > Packed
 *
 * Only segments that resolve to a real route render as links —
 * grouping-only segments (e.g. /store/challan) render as plain text.
 */

const LABEL_MAP: Record<string, string> = {
  admin:    'Admin',
  store:    'Store',
  kitchen:  'Kitchen',
  canteen:  'Canteen',
  dashboard:'Dashboard',
  users:    'User Management',
  roles:    'Roles & Permissions',
  stock:    'Stock View',
  daybook:  'Day Book',
  ledger:   'Ledger',
  po:       'Purchase Orders',
  create:   'Create',
  challan:  'Challan',
  received: 'Received',
  packed:   'Packed',
  unpacked: 'Unpacked',
  request:  'Request Material',
  transfer: 'Transfer Material',
  inventory:'Inventory',
  reports:  'Reports',
  audit:    'Audit Logs',
  settings: 'Settings',
  profile:  'Profile',
  notifications: 'Notifications',
}

const toLabel = (segment: string): string =>
  LABEL_MAP[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)

const AppBreadcrumb = () => {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  const items = [
    {
      title: (
        <Link to="/" aria-label="Home">
          <HomeOutlined />
        </Link>
      ),
    },
    ...segments.map((seg, i) => {
      const path = '/' + segments.slice(0, i + 1).join('/')
      const isLast = i === segments.length - 1
      const linkable = !isLast && isRoutablePath(path)

      return {
        title: linkable ? (
          <Link to={path}>{toLabel(seg)}</Link>
        ) : (
          <span>{toLabel(seg)}</span>
        ),
      }
    }),
  ]

  return <Breadcrumb items={items} style={{ marginBottom: 16 }} />
}

export default AppBreadcrumb