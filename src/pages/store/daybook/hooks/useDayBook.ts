import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { storeApi } from '@/api/store.api'

/**
 * STORE-014 Day Book — item-wise daily movement register for a single
 * date at a location. Date defaults to today and cannot be in the future.
 */
export const useDayBook = (locationId: number | null) => {
  const [date, setDate] = useState<Dayjs>(dayjs())

  const isoDate = date.format('YYYY-MM-DD')

  const query = useQuery({
    queryKey: ['store', 'daybook', { locationId, isoDate }],
    queryFn: ({ signal }) =>
      storeApi.getDayBook(locationId as number, isoDate, signal),
    enabled: locationId != null,
    placeholderData: keepPreviousData,
  })

  return { query, date, setDate }
}
