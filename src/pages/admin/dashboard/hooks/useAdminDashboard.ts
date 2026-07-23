import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'
import { healthApi } from '@/api/health.api'
import type { UserCounts } from '@/types/admin.types'
import type { StatCardData } from '../types/dashboard.types'

/**
 * Dashboard queries — real data only.
 * KPI cards derive from GET /api/admin/users/count { total, active, inactive }.
 * Login-activity and recent-activity panels were removed: no backend
 * endpoints exist yet, and mock numbers must never render as real.
 */

const toStatCards = (counts: UserCounts): StatCardData[] => [
  {
    id: 'total-users',
    label: 'Total Users',
    value: counts.total ?? 0,
    icon: 'users',
    tone: 'blue',
  },
  {
    id: 'active-users',
    label: 'Active Users',
    value: counts.active ?? 0,
    icon: 'activity',
    tone: 'green',
  },
  {
    id: 'inactive-users',
    label: 'Inactive Users',
    value: counts.inactive ?? 0,
    icon: 'clipboard',
    tone: 'amber',
  },
]

export const useAdminDashboard = () => {
  const statCards = useQuery({
    queryKey: ['admin', 'user-counts'],
    queryFn: () => adminApi.getUserCounts(),
    select: toStatCards,
  })

  const serviceHealth = useQuery({
    queryKey: ['admin', 'service-health'],
    queryFn: () => healthApi.checkAllServices(),
    refetchInterval: 60_000, // health panel stays current
  })

  return { statCards, serviceHealth }
}
