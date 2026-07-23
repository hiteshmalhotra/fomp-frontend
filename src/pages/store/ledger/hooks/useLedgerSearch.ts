import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { storeApi } from '@/api/store.api'
import type { MovementFilter } from '@/types/store.types'

export interface LedgerFilters {
  itemId?: number
  fromDate?: string // ISO yyyy-MM-dd
  toDate?: string
  type: MovementFilter
}

/**
 * STORE-013 server-driven ledger table. Location is required; item,
 * date range and movement type are optional filters. All execute on
 * the backend — the append-only ledger is never fetched unbounded.
 */
export const useLedgerSearch = (locationId: number | null) => {
  const [filters, setFilters] = useState<LedgerFilters>({ type: 'ALL' })
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  const query = useQuery({
    queryKey: ['store', 'ledger-search', { locationId, filters, page, size }],
    queryFn: ({ signal }) =>
      storeApi.searchLedger(
        {
          locationId: locationId as number,
          itemId: filters.itemId,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          type: filters.type,
          page,
          size,
        },
        signal
      ),
    enabled: locationId != null,
    placeholderData: keepPreviousData,
  })

  const items = useQuery({
    queryKey: ['store', 'items-lookup'],
    queryFn: ({ signal }) => storeApi.getItems(signal),
    staleTime: 1000 * 60 * 30, // reference data
  })

  // Any filter change returns to the first page
  const updateFilters = (next: Partial<LedgerFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }))
    setPage(0)
  }

  return {
    query,
    items,
    filters,
    page,
    size,
    updateFilters,
    setPage,
    setSize,
  }
}
