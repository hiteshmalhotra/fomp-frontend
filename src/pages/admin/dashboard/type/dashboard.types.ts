export interface StatCardData {
  id: string
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
  iconBg: string
}

export interface UserRow {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'Admin' | 'Store Manager' | 'Kitchen Manager' | 'Canteen Manager'
  department: string
  lastLogin: string
  status: 'active' | 'inactive'
}

export interface ServiceHealth {
  name: string
  status: 'healthy' | 'degraded' | 'down'
}

export interface ActivityItem {
  id: string
  icon: 'user' | 'role' | 'login' | 'permission'
  title: string
  timestamp: string
}

export interface LoginActivityPoint {
  date: string
  count: number
}