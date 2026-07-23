import type { UserRole } from '@/types/auth.types'

export const ROLE_LABELS: Record<UserRole, string> = {
  ROLE_ADMIN: 'Admin',
  ROLE_STORE_MANAGER: 'Store Manager',
  ROLE_KITCHEN_MANAGER: 'Kitchen Manager',
  ROLE_CANTEEN_MANAGER: 'Canteen Manager',
  ROLE_USER: 'User',
}

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  ROLE_ADMIN: '/admin/dashboard',
  ROLE_STORE_MANAGER: '/store/dashboard',
  ROLE_KITCHEN_MANAGER: '/kitchen/dashboard',
  ROLE_CANTEEN_MANAGER: '/canteen/dashboard',
  ROLE_USER: '/profile',
}

export const APP_NAME = 'Food Operations Management Platform'
export const APP_SHORT_NAME = 'FOMP'
export const APP_VERSION = '1.0.0'
