import type { UserRole } from '@/types/auth.types'

/**
 * Maps a JWT role claim to the post-login dashboard route.
 * Used in useLogin hook after successful authentication.
 */
const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  ROLE_ADMIN:            '/admin/dashboard',
  ROLE_STORE_MANAGER:    '/store/dashboard',
  ROLE_KITCHEN_MANAGER:  '/kitchen/dashboard',
  ROLE_CANTEEN_MANAGER:  '/canteen/dashboard',
  ROLE_USER:             '/profile',
}

/**
 * Returns the dashboard route for a given role.
 * Falls back to /login if role is unrecognised.
 */
export const getDashboardRoute = (role: UserRole | null | undefined): string => {
  if (!role) return '/login'
  return ROLE_DASHBOARD_MAP[role] ?? '/login'
}

/**
 * Returns the display label for a role.
 * Used in nav header, profile badge, user management table.
 */
export const getRoleLabel = (role: UserRole | null | undefined): string => {
  const labels: Record<UserRole, string> = {
    ROLE_ADMIN:            'Admin',
    ROLE_STORE_MANAGER:    'Store Manager',
    ROLE_KITCHEN_MANAGER:  'Kitchen Manager',
    ROLE_CANTEEN_MANAGER:  'Canteen Manager',
    ROLE_USER:             'User',
  }
  if (!role) return 'Unknown'
  return labels[role] ?? role
}

/**
 * Returns the Ant Design Tag color for a role badge.
 * Matches the design system defined in the project reference.
 */
export const getRoleBadgeColor = (role: UserRole | null | undefined): string => {
  const colors: Record<UserRole, string> = {
    ROLE_ADMIN:            '#C0392B',
    ROLE_STORE_MANAGER:    '#1A7A6E',
    ROLE_KITCHEN_MANAGER:  '#E9A825',
    ROLE_CANTEEN_MANAGER:  '#2980B9',
    ROLE_USER:             '#7A8899',
  }
  if (!role) return '#7A8899'
  return colors[role] ?? '#7A8899'
}