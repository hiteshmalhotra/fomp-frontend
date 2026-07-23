import { useQuery } from '@tanstack/react-query'
import { storeApi } from '@/api/store.api'

/**
 * STORE-001 widget queries. Each widget loads and fails independently
 * (spec: API failure per widget → that widget shows an error state).
 */
export const useStoreDashboard = (locationId: number | null) => {
  const enabled = locationId != null

  const summary = useQuery({
    queryKey: ['store', 'dashboard-summary', locationId],
    queryFn: ({ signal }) =>
      storeApi.getDashboardSummary(locationId as number, signal),
    enabled,
  })

  const lowStock = useQuery({
    queryKey: ['store', 'low-stock', locationId],
    queryFn: ({ signal }) => storeApi.getLowStock(locationId as number, signal),
    enabled,
  })

  const recentPOs = useQuery({
    queryKey: ['store', 'recent-pos'],
    queryFn: ({ signal }) => storeApi.getRecentPOs(signal),
  })

  const recentChallans = useQuery({
    queryKey: ['store', 'recent-challans'],
    queryFn: ({ signal }) => storeApi.getRecentChallans(signal),
  })

  return { summary, lowStock, recentPOs, recentChallans }
}
