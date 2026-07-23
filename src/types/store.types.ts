// ─── Store-service types — mirror backend DTOs exactly ───────────────────────

export type LocationType = 'CENTRAL_STORE' | 'CANTEEN' | 'KITCHEN' | 'OTHER'

export type POStatus =
  | 'DRAFT'
  | 'SENT'
  | 'PARTIALLY_RECEIVED'
  | 'FULLY_RECEIVED'
  | 'CANCELLED'
  | 'CLOSED'

export type ChallanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'PACKING'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'DISPUTED'
  | 'CANCELLED'

// StoreLocationResponse
export interface StoreLocation {
  id: number
  name: string
  locationCode: string
  description: string | null
  locationType: LocationType
  active: boolean
}

// ItemCategoryResponse
export interface ItemCategory {
  id: number
  name: string
  description: string | null
  active: boolean
  itemCount: number
}

// StockResponse
export interface StockRow {
  id: number
  itemId: number
  itemName: string
  itemCode: string
  unitName: string
  locationId: number
  locationName: string
  locationCode: string
  quantity: number
  reorderLevel: number
  maxStockLevel: number | null
  belowReorderLevel: boolean
  averagePrice: number | null
  lastPurchasePrice: number | null
  stockValue: number | null
  lastMovementAt: string | null
  lastUpdatedAt: string | null
}

// StoreDashboardSummaryResponse
export interface StoreDashboardSummary {
  totalStockItems: number
  lowStockCount: number
  pendingPoCount: number
  pendingChallanCount: number
  totalStockValue: number
}

// POResponse (list-view fields used in S1)
export interface PurchaseOrder {
  id: number
  poNumber: string
  supplierId: number
  supplierName: string
  status: POStatus
  poDate: string
  expectedDeliveryDate: string | null
  totalAmount: number | null
  createdAt: string
}

// ChallanResponse (list-view fields used in S1)
export interface TransferChallan {
  id: number
  challanNumber: string
  fromLocationName: string
  toLocationName: string
  status: ChallanStatus
  challanDate: string
  expectedDeliveryDate: string | null
  totalValue: number | null
  hasShortage: boolean
  createdAt: string
}

// ─── Derived stock status (STORE-012 BR-001/002/004) ─────────────────────────
export type StockStatus = 'OK' | 'LOW' | 'CRITICAL'

export const getStockStatus = (row: StockRow): StockStatus => {
  if (row.quantity <= 0) return 'CRITICAL' // BR-004 zero stock
  if (row.quantity <= row.reorderLevel * 0.5) return 'CRITICAL' // BR-002
  if (row.quantity <= row.reorderLevel) return 'LOW' // BR-001
  return 'OK'
}

// ─── Request params ──────────────────────────────────────────────────────────
export interface StockSearchParams {
  locationId: number
  categoryId?: number
  search?: string
  page?: number
  size?: number
}
