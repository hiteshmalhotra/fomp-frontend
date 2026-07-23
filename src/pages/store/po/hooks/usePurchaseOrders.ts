import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { storeApi } from '@/api/store.api'
import type { POStatus, POStatusFilter } from '@/types/store.types'

/**
 * STORE-006 server-driven PO list: status, supplier and date-range
 * filters plus pagination all execute on the backend (default sort
 * createdAt DESC applied server-side).
 */
export const usePurchaseOrders = () => {
  const [status, setStatus] = useState<POStatusFilter>('ALL')
  const [supplierId, setSupplierId] = useState<number | undefined>(undefined)
  const [fromDate, setFromDate] = useState<string | undefined>(undefined)
  const [toDate, setToDate] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const query = useQuery({
    queryKey: [
      'store',
      'po-list',
      { status, supplierId, fromDate, toDate, page, size },
    ],
    queryFn: ({ signal }) =>
      storeApi.searchPOs(
        {
          status: status === 'ALL' ? undefined : (status as POStatus),
          supplierId,
          fromDate,
          toDate,
          page,
          size,
        },
        signal
      ),
    placeholderData: keepPreviousData,
  })

  const suppliers = useQuery({
    queryKey: ['store', 'suppliers'],
    queryFn: ({ signal }) => storeApi.getSuppliers(signal),
    staleTime: 1000 * 60 * 30,
  })

  const setDateRange = (from?: string, to?: string) => {
    setFromDate(from)
    setToDate(to)
    setPage(0)
  }

  return {
    query,
    suppliers,
    status,
    supplierId,
    page,
    size,
    setStatus: (s: POStatusFilter) => {
      setStatus(s)
      setPage(0)
    },
    setSupplierId: (id: number | undefined) => {
      setSupplierId(id)
      setPage(0)
    },
    setDateRange,
    setPage,
    setSize,
  }
}
