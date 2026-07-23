import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { storeApi } from '@/api/store.api'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * STORE-012 server-driven stock table: location, category and search
 * filters plus pagination all execute on the backend.
 */
export const useStockSearch = (locationId: number | null) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const search = useDebounce(searchTerm.trim(), 300)

  const query = useQuery({
    queryKey: [
      'store',
      'stock-search',
      { locationId, categoryId, search, page, size },
    ],
    queryFn: ({ signal }) =>
      storeApi.searchStock(
        {
          locationId: locationId as number,
          categoryId,
          search: search || undefined,
          page,
          size,
        },
        signal
      ),
    enabled: locationId != null,
    placeholderData: keepPreviousData,
  })

  const categories = useQuery({
    queryKey: ['store', 'categories'],
    queryFn: ({ signal }) => storeApi.getCategories(signal),
    staleTime: 1000 * 60 * 30, // reference data
  })

  // Filter changes return to the first page
  const updateSearch = (value: string) => {
    setSearchTerm(value)
    setPage(0)
  }
  const updateCategory = (value: number | undefined) => {
    setCategoryId(value)
    setPage(0)
  }

  return {
    query,
    categories,
    searchTerm,
    categoryId,
    page,
    size,
    setSearchTerm: updateSearch,
    setCategoryId: updateCategory,
    setPage,
    setSize,
  }
}
