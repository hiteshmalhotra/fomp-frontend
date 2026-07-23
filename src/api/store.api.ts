import apiClient from './client'
import type { ApiSuccess, PaginatedData } from '@/types/common.types'
import type {
  DayBook,
  ItemCategory,
  ItemLookup,
  LedgerRow,
  LedgerSearchParams,
  PurchaseOrder,
  StockRow,
  StockSearchParams,
  StoreDashboardSummary,
  StoreLocation,
  TransferChallan,
} from '@/types/store.types'

export const storeApi = {
  // ── Dashboard (STORE-001) ─────────────────────────────────────────────

  getDashboardSummary: (locationId: number, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<StoreDashboardSummary>>('/api/store/dashboard/summary', {
        params: { locationId },
        signal,
      })
      .then((r) => r.data.data),

  getLowStock: (locationId: number, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<StockRow[]>>(`/api/store/stock/low-stock/${locationId}`, {
        signal,
      })
      .then((r) => r.data.data),

  // Recent activity feeds — first page, newest first
  getRecentPOs: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<PurchaseOrder>>>('/api/store/po', {
        params: { page: 0, size: 5, sort: 'createdAt,desc' },
        signal,
      })
      .then((r) => r.data.data),

  getRecentChallans: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<TransferChallan>>>('/api/store/challans', {
        params: { page: 0, size: 5, sort: 'createdAt,desc' },
        signal,
      })
      .then((r) => r.data.data),

  // ── Stock View (STORE-012) ────────────────────────────────────────────

  searchStock: (params: StockSearchParams, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<StockRow>>>('/api/store/stock/search', {
        params,
        signal,
      })
      .then((r) => r.data.data),

  // ── Stock Ledger (STORE-013) ──────────────────────────────────────────

  searchLedger: (params: LedgerSearchParams, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<LedgerRow>>>('/api/store/ledger', {
        params,
        signal,
      })
      .then((r) => r.data.data),

  // ── Day Book (STORE-014) ──────────────────────────────────────────────

  getDayBook: (locationId: number, date: string, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<DayBook>>('/api/store/ledger/daybook', {
        params: { locationId, date },
        signal,
      })
      .then((r) => r.data.data),

  // ── Reference data ────────────────────────────────────────────────────

  getLocations: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<StoreLocation[]>>('/api/store/locations', { signal })
      .then((r) => r.data.data),

  getCentralStore: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<StoreLocation>>('/api/store/locations/central-store', {
        signal,
      })
      .then((r) => r.data.data),

  getCategories: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<ItemCategory[]>>('/api/store/categories', { signal })
      .then((r) => r.data.data),

  // Active items — used to populate filter dropdowns
  getItems: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<ItemLookup[]>>('/api/store/items', { signal })
      .then((r) => r.data.data),
}
