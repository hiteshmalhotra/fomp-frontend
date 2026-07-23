export type StatTone = 'blue' | 'green' | 'amber'

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
