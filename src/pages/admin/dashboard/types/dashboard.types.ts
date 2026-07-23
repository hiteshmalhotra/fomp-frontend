import type { StatTone } from '@/components/common/StatCard'

export interface StatCardData {
  id: string
  label: string
  value: string | number
  icon: 'users' | 'activity' | 'server' | 'clipboard'
  tone: StatTone
}

export interface ServiceHealth {
  name: string
  status: 'healthy' | 'degraded' | 'down'
}
