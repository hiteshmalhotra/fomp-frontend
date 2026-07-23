import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { storeApi } from '@/api/store.api'
import { useStoreLocationStore } from '@/store/storeLocation.store'

/**
 * Loads store locations and resolves the active location:
 * persisted selection if still valid, otherwise the central store,
 * otherwise the first active location.
 */
export const useStoreLocations = () => {
  const { locationId, setLocationId } = useStoreLocationStore()

  const locations = useQuery({
    queryKey: ['store', 'locations'],
    queryFn: ({ signal }) => storeApi.getLocations(signal),
    staleTime: 1000 * 60 * 30, // reference data — rarely changes
  })

  // Resolve a default once locations arrive
  useEffect(() => {
    if (!locations.data || locations.data.length === 0) return
    const stillValid =
      locationId != null &&
      locations.data.some((l) => l.id === locationId && l.active)
    if (stillValid) return

    const central = locations.data.find(
      (l) => l.locationType === 'CENTRAL_STORE' && l.active
    )
    const fallback = locations.data.find((l) => l.active)
    const next = central ?? fallback
    if (next) setLocationId(next.id)
  }, [locations.data, locationId, setLocationId])

  return {
    locations: locations.data ?? [],
    locationsLoading: locations.isLoading,
    locationsError: locations.isError,
    locationId,
    setLocationId,
  }
}
