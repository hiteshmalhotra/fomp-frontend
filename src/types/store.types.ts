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

// Minimal item shape for filter dropdowns (subset of ItemResponse).
// The full Item type arrives with the Items master screen (S5).
export interface ItemLookup {
  id: number
  name: string
  itemCode: string
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

// ─── Ledger (STORE-013) ──────────────────────────────────────────────────────
export type LedgerType =
  | 'OPENING_STOCK'
  | 'PO_RECEIPT'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'RETURN_TO_STORE'
  | 'PRODUCTION_CONSUMPTION'
  | 'PRODUCTION_RECEIPT'

export type MovementDirection = 'IN' | 'OUT'
export type MovementFilter = MovementDirection | 'ALL'

// LedgerResponse
export interface LedgerRow {
  id: number
  itemId: number
  itemName: string
  itemCode: string
  unitName: string
  locationId: number
  locationName: string
  locationCode: string
  type: LedgerType
  movementDirection: MovementDirection
  quantity: number
  balanceAfter: number
  unitPrice: number | null
  totalValue: number | null
  referenceType: string | null
  referenceNumber: string | null
  counterpartLocationName: string | null
  transactionDate: string
  remarks: string | null
  createdBy: string
  createdAt: string
}

// ─── Day Book (STORE-014) ────────────────────────────────────────────────────
// DayBookLineResponse
export interface DayBookLine {
  itemId: number
  itemName: string
  itemCode: string
  unitName: string
  openingQty: number
  poReceiptQty: number
  transferInQty: number
  returnQty: number
  transferOutQty: number
  productionConsumptionQty: number
  productionReceiptQty: number
  adjustmentInQty: number
  adjustmentOutQty: number // includes wastage
  closingQty: number
}

// DayBookResponse
export interface DayBook {
  date: string
  locationId: number
  locationName: string
  lines: DayBookLine[]
}

// ─── Request params ──────────────────────────────────────────────────────────
export interface StockSearchParams {
  locationId: number
  categoryId?: number
  search?: string
  page?: number
  size?: number
}

export interface LedgerSearchParams {
  locationId: number
  itemId?: number
  fromDate?: string
  toDate?: string
  type?: MovementFilter
  page?: number
  size?: number
}

// ─── Ledger type labels ──────────────────────────────────────────────────────
export const LEDGER_TYPE_LABELS: Record<LedgerType, string> = {
  OPENING_STOCK: 'Opening Stock',
  PO_RECEIPT: 'PO Receipt',
  TRANSFER_OUT: 'Transfer Out',
  TRANSFER_IN: 'Transfer In',
  ADJUSTMENT_IN: 'Adjustment In',
  ADJUSTMENT_OUT: 'Adjustment Out',
  RETURN_TO_STORE: 'Return to Store',
  PRODUCTION_CONSUMPTION: 'Production Consumption',
  PRODUCTION_RECEIPT: 'Production Receipt',
}
