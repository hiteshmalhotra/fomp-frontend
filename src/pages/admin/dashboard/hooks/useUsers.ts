import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'
import { useDebounce } from '@/hooks/useDebounce'
import type { PaginatedData } from '@/types/common.types'
import type { AdminUser } from '@/types/admin.types'
import type { UserRole } from '@/types/auth.types'

export type RoleFilter = UserRole | 'ALL'
export type StatusFilter = 'ACTIVE' | 'INACTIVE' | 'ALL'

/**
 * Server-driven user table state: search, role/status filters and
 * pagination all execute on the backend — the client never filters
 * a partial page. Search is debounced 300ms.
 */
export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const search = useDebounce(searchTerm.trim(), 300)

  const query = useQuery<PaginatedData<AdminUser>>({
    queryKey: ['admin', 'users', { search, roleFilter, statusFilter, page, size }],
    queryFn: () =>
      adminApi.getUsers({
        search: search || undefined,
        role: roleFilter,
        status: statusFilter,
        page,
        size,
      }),
    placeholderData: keepPreviousData,
  })

  // Any filter change returns to the first page
  const updateSearch = (value: string) => {
    setSearchTerm(value)
    setPage(0)
  }
  const updateRole = (value: RoleFilter) => {
    setRoleFilter(value)
    setPage(0)
  }
  const updateStatus = (value: StatusFilter) => {
    setStatusFilter(value)
    setPage(0)
  }

  return {
    query,
    searchTerm,
    roleFilter,
    statusFilter,
    page,
    size,
    setSearchTerm: updateSearch,
    setRoleFilter: updateRole,
    setStatusFilter: updateStatus,
    setPage,
    setSize,
  }
}
