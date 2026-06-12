import type { UserRole } from '@/types/auth.types'

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ROLE_ADMIN: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/reports',
    '/admin/po-approvals',
    '/admin/challan-approvals',
    '/admin/stock',
    '/admin/audit',
    '/admin/settings',
    '/profile',
    '/notifications',
  ],
  ROLE_STORE_MANAGER: [
    '/store/dashboard',
    '/store/items',
    '/store/suppliers',
    '/store/purchase-orders',
    '/store/challans',
    '/store/stock',
    '/store/stock/ledger',
    '/store/stock/alerts',
    '/profile',
    '/notifications',
  ],
  ROLE_KITCHEN_MANAGER: [
    '/kitchen/dashboard',
    '/kitchen/recipes',
    '/kitchen/production-orders',
    '/kitchen/transfers',
    '/kitchen/batches',
    '/kitchen/stock',
    '/profile',
    '/notifications',
  ],
  ROLE_CANTEEN_MANAGER: [
    '/canteen/dashboard',
    '/canteen/menu-items',
    '/canteen/preparation-orders',
    '/canteen/consumption',
    '/canteen/wastage',
    '/canteen/transfers',
    '/canteen/daily-reports',
    '/profile',
    '/notifications',
  ],
  ROLE_USER: ['/profile', '/notifications'],
}

export const hasPermission = (
  role: UserRole | null,
  path: string
): boolean => {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.some((p) => path.startsWith(p)) ?? false
}

export const getAllowedRoutes = (role: UserRole | null): string[] => {
  if (!role) return []
  return ROLE_PERMISSIONS[role] ?? []
}