import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { storeApi } from '@/api/store.api'
import type {
  ChallanDirection,
  ChallanStatus,
  ChallanStatusFilter,
} from '@/types/store.types'

/**
 * STORE-009 server-driven challan list. Direction (Outgoing/Incoming) maps
 * to fromLocationId/toLocationId against the selected location; status and
 * date filters are optional. Default sort challanDate DESC server-side.
 */
export const useChallans = (locationId: number | null) => {
  const [direction, setDirection] = useState<ChallanDirection>('OUTGOING')
  const [status, setStatus] = useState<ChallanStatusFilter>('ALL')
  const [fromDate, setFromDate] = useState<string | undefined>(undefined)
  const [toDate, setToDate] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const query = useQuery({
    queryKey: [
      'store',
      'challan-list',
      { locationId, direction, status, fromDate, toDate, page, size },
    ],
    queryFn: ({ signal }) =>
      storeApi.searchChallans(
        {
          status: status === 'ALL' ? undefined : (status as ChallanStatus),
          fromLocationId:
            direction === 'OUTGOING' ? (locationId as number) : undefined,
          toLocationId:
            direction === 'INCOMING' ? (locationId as number) : undefined,
          fromDate,
          toDate,
          page,
          size,
        },
        signal
      ),
    enabled: locationId != null,
    placeholderData: keepPreviousData,
  })

  return {
    query,
    direction,
    status,
    page,
    size,
    setDirection: (d: ChallanDirection) => {
      setDirection(d)
      setPage(0)
    },
    setStatus: (s: ChallanStatusFilter) => {
      setStatus(s)
      setPage(0)
    },
    setDateRange: (from?: string, to?: string) => {
      setFromDate(from)
      setToDate(to)
      setPage(0)
    },
    setPage,
    setSize,
  }
}
