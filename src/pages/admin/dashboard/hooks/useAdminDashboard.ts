import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'
import { healthApi } from '@/api/health.api'
import type { PaginatedData } from '@/types/common.types'
import type { AdminUser, UserCounts } from '@/types/admin.types'
import {
  mockLoginActivity,
  mockActivities,
  mockStatCards,
} from '../data/mockDashboardData'

const fetchServiceHealth = () => healthApi.checkAllServices()

const fetchLoginActivity = async () => {
  await new Promise((r) => setTimeout(r, 300))
  return mockLoginActivity
}
const fetchActivities = async () => {
  await new Promise((r) => setTimeout(r, 300))
  return mockActivities
}

export const useAdminDashboard = () => {
  const users = useQuery<PaginatedData<AdminUser>>({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers({ page: 0, size: 10 }),
  })

  const userCounts = useQuery<UserCounts>({
    queryKey: ['admin', 'user-counts'],
    queryFn: () => adminApi.getUserCounts(),
  })

  const statCards = useQuery({
    queryKey: ['admin', 'stat-cards'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300))
      return mockStatCards
    },
  })

  const serviceHealth = useQuery({ queryKey: ['admin', 'service-health'], queryFn: fetchServiceHealth })
  const loginActivity = useQuery({ queryKey: ['admin', 'login-activity'], queryFn: fetchLoginActivity })
  const activities = useQuery({ queryKey: ['admin', 'activities'], queryFn: fetchActivities })

  return { statCards, users, userCounts, serviceHealth, loginActivity, activities }
}