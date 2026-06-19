import type { UserRole } from '@/types/auth.types'

export const ROLE_TAG_COLORS: Record<UserRole, string> = {
  ROLE_ADMIN: 'red',
  ROLE_STORE_MANAGER: 'green',
  ROLE_KITCHEN_MANAGER: 'gold',
  ROLE_CANTEEN_MANAGER: 'blue',
  ROLE_USER: 'default',
}

export const ACTIVITY_ICON_MAP: Record<string, string> = {
  user: '👤',
  role: '🛡️',
  login: '🔑',
  permission: '⚙️',
}