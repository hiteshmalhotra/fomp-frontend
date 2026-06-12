import type { UserRole } from '@/types/auth.types'

export const ROLE_LABELS: Record<UserRole, string> = {
  ROLE_ADMIN: 'Admin',
  ROLE_STORE_MANAGER: 'Store Manager',
  ROLE_KITCHEN_MANAGER: 'Kitchen Manager',
  ROLE_CANTEEN_MANAGER: 'Canteen Manager',
  ROLE_USER: 'User',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  ROLE_ADMIN: '#C0392B',
  ROLE_STORE_MANAGER: '#1A7A6E',
  ROLE_KITCHEN_MANAGER: '#E9A825',
  ROLE_CANTEEN_MANAGER: '#2980B9',
  ROLE_USER: '#7A8899',
}

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  ROLE_ADMIN: '/admin/dashboard',
  ROLE_STORE_MANAGER: '/store/dashboard',
  ROLE_KITCHEN_MANAGER: '/kitchen/dashboard',
  ROLE_CANTEEN_MANAGER: '/canteen/dashboard',
  ROLE_USER: '/profile',
}

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#5A7A84',
  SENT: '#1A7A6E',
  RECEIVED: '#27AE60',
  CLOSED: '#162230',
  APPROVED: '#27AE60',
  REJECTED: '#C0392B',
  SUBMITTED: '#2980B9',
  PENDING: '#E67E22',
  IN_PROGRESS: '#E67E22',
  COMPLETED: '#27AE60',
  DISPATCHED: '#1A7A6E',
  VERIFIED: '#27AE60',
  LOW: '#C0392B',
  OK: '#27AE60',
}

export const APP_NAME = 'Food Operations Management Platform'
export const APP_SHORT_NAME = 'FOMP'
export const APP_VERSION = '1.0.0'