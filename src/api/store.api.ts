import apiClient from './client'
import type { ApiSuccess, PaginatedData } from '@/types/common.types'
import type {
  ChallanApprovalPayload,
  ChallanCreateRequest,
  ChallanDispatchPayload,
  ChallanPackPayload,
  ChallanReceiptPayload,
  ChallanSearchParams,
  DayBook,
  ItemCategory,
  ItemLookup,
  LedgerRow,
  LedgerSearchParams,
  POCreateRequest,
  POReceiptRequestPayload,
  POSearchParams,
  PurchaseOrder,
  PurchaseOrderDetail,
  StockRow,
  StockSearchParams,
  StoreDashboardSummary,
  StoreLocation,
  Supplier,
  TransferChallan,
  TransferChallanDetail,
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

  // ── Purchase Orders (STORE-006/007/008) ───────────────────────────────

  searchPOs: (params: POSearchParams, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<PurchaseOrder>>>('/api/store/po', {
        params,
        signal,
      })
      .then((r) => r.data.data),

  getPO: (id: number, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PurchaseOrderDetail>>(`/api/store/po/${id}`, { signal })
      .then((r) => r.data.data),

  createPO: (data: POCreateRequest) =>
    apiClient
      .post<ApiSuccess<PurchaseOrderDetail>>('/api/store/po', data)
      .then((r) => r.data.data),

  sendPO: (id: number) =>
    apiClient
      .put<ApiSuccess<PurchaseOrderDetail>>(`/api/store/po/${id}/send`)
      .then((r) => r.data.data),

  receivePO: (id: number, data: POReceiptRequestPayload) =>
    apiClient
      .put<ApiSuccess<PurchaseOrderDetail>>(`/api/store/po/${id}/receive`, data)
      .then((r) => r.data.data),

  cancelPO: (id: number, reason: string) =>
    apiClient
      .put<ApiSuccess<PurchaseOrderDetail>>(`/api/store/po/${id}/cancel`, null, {
        params: { reason },
      })
      .then((r) => r.data.data),

  // ── Transfer Challans (STORE-009/010/011) ─────────────────────────────

  searchChallans: (params: ChallanSearchParams, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<PaginatedData<TransferChallan>>>('/api/store/challans', {
        params,
        signal,
      })
      .then((r) => r.data.data),

  getChallan: (id: number, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<TransferChallanDetail>>(`/api/store/challans/${id}`, {
        signal,
      })
      .then((r) => r.data.data),

  createChallan: (data: ChallanCreateRequest) =>
    apiClient
      .post<ApiSuccess<TransferChallanDetail>>('/api/store/challans', data)
      .then((r) => r.data.data),

  // ── Challan workflow transitions ──────────────────────────────────────

  submitChallan: (id: number) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(`/api/store/challans/${id}/submit`)
      .then((r) => r.data.data),

  approveChallan: (id: number, approvals: ChallanApprovalPayload[]) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/approve`,
        approvals
      )
      .then((r) => r.data.data),

  packChallan: (id: number, data: ChallanPackPayload) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/pack`,
        data
      )
      .then((r) => r.data.data),

  dispatchChallan: (id: number, data: ChallanDispatchPayload) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/dispatch`,
        data
      )
      .then((r) => r.data.data),

  acknowledgeChallan: (id: number) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/acknowledge`
      )
      .then((r) => r.data.data),

  receiveChallan: (id: number, data: ChallanReceiptPayload) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/receive`,
        data
      )
      .then((r) => r.data.data),

  verifyChallan: (id: number, remarks?: string) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/verify`,
        null,
        { params: remarks ? { remarks } : undefined }
      )
      .then((r) => r.data.data),

  cancelChallan: (id: number, reason: string) =>
    apiClient
      .put<ApiSuccess<TransferChallanDetail>>(
        `/api/store/challans/${id}/cancel`,
        null,
        { params: { reason } }
      )
      .then((r) => r.data.data),

  // ── Suppliers ─────────────────────────────────────────────────────────

  getSuppliers: (signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<Supplier[]>>('/api/store/suppliers', { signal })
      .then((r) => r.data.data),

  // Full stock list at a location — used for available-qty lookup in
  // Create Challan (STORE-010).
  getStockByLocation: (locationId: number, signal?: AbortSignal) =>
    apiClient
      .get<ApiSuccess<StockRow[]>>(
        `/api/store/stock/location/${locationId}`,
        { signal }
      )
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
