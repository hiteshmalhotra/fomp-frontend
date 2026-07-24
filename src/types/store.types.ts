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

// POResponse (list-view fields)
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

// SupplierResponse (dropdown subset)
export interface Supplier {
  id: number
  name: string
  supplierCode: string
  active: boolean
}

// POLineItemResponse
export interface POLineItem {
  id: number
  itemId: number
  itemName: string
  itemCode: string
  unitName: string
  orderedQuantity: number
  receivedQuantity: number
  pendingQuantity: number
  unitPrice: number
  actualUnitPrice: number | null
  lineTotal: number
  actualLineTotal: number | null
  fullyReceived: boolean
  remarks: string | null
}

// POResponse (full detail — STORE-008)
export interface PurchaseOrderDetail {
  id: number
  poNumber: string
  supplierId: number
  supplierName: string
  deliveryLocationId: number
  deliveryLocationName: string
  status: POStatus
  poDate: string
  expectedDeliveryDate: string | null
  actualDeliveryDate: string | null
  totalAmount: number | null
  receivedAmount: number | null
  autoSuggested: boolean
  suggestionReason: string | null
  billNumber: string | null
  billDate: string | null
  billAmount: number | null
  notes: string | null
  createdBy: string
  approvedBy: string | null
  receivedBy: string | null
  createdAt: string
  lineItems: POLineItem[]
}

// ChallanResponse (list-view fields)
export interface TransferChallan {
  id: number
  challanNumber: string
  fromLocationId: number
  fromLocationName: string
  toLocationId: number
  toLocationName: string
  status: ChallanStatus
  challanDate: string
  expectedDeliveryDate: string | null
  totalValue: number | null
  hasShortage: boolean
  createdAt: string
}

// ChallanLineItemResponse
export interface ChallanLineItem {
  id: number
  itemId: number
  itemName: string
  itemCode: string
  unitName: string
  requestedQuantity: number
  approvedQuantity: number | null
  packedQuantity: number | null
  dispatchedQuantity: number | null
  receivedQuantity: number | null
  shortageQuantity: number | null
  shortageReason: string | null
  averagePrice: number | null
  lineValue: number | null
  hasShortage: boolean
  fullyReceived: boolean
  packingRemarks: string | null
  receiptRemarks: string | null
}

// ChallanResponse (full detail — STORE-011)
export interface TransferChallanDetail {
  id: number
  challanNumber: string
  fromLocationId: number
  fromLocationName: string
  fromLocationCode: string
  toLocationId: number
  toLocationName: string
  toLocationCode: string
  status: ChallanStatus
  challanDate: string
  expectedDeliveryDate: string | null
  dispatchedDate: string | null
  receivedDate: string | null
  verifiedDate: string | null
  totalValue: number | null
  hasShortage: boolean
  shortageRemarks: string | null
  vehicleNumber: string | null
  driverName: string | null
  createdBy: string
  approvedBy: string | null
  dispatchedBy: string | null
  receivedBy: string | null
  verifiedBy: string | null
  createdAt: string
  lineItems: ChallanLineItem[]
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

export type POStatusFilter = POStatus | 'ALL'

export interface POSearchParams {
  status?: POStatus // omit for ALL
  supplierId?: number
  fromDate?: string
  toDate?: string
  page?: number
  size?: number
}

// ─── Challan (STORE-009/010/011) ─────────────────────────────────────────────
export type ChallanDirection = 'OUTGOING' | 'INCOMING'
export type ChallanStatusFilter = ChallanStatus | 'ALL'

export interface ChallanSearchParams {
  status?: ChallanStatus
  fromLocationId?: number
  toLocationId?: number
  fromDate?: string
  toDate?: string
  page?: number
  size?: number
}

// ChallanRequest / ChallanLineItemRequest
export interface ChallanLineItemPayload {
  itemId: number
  requestedQuantity: number
  remarks?: string
}

export interface ChallanCreateRequest {
  fromLocationId: number
  toLocationId: number
  expectedDeliveryDate?: string
  requestRemarks?: string
  lineItems: ChallanLineItemPayload[]
}

// Transition payloads
export interface ChallanApprovalPayload {
  lineItemId: number
  approvedQuantity: number
  remarks?: string
}

export interface ChallanPackPayload {
  packItems: { lineItemId: number; packedQuantity: number; remarks?: string }[]
  packingRemarks?: string
  numberOfPackages?: number
}

export interface ChallanDispatchPayload {
  vehicleNumber?: string
  driverName?: string
  dispatchRemarks?: string
}

export interface ChallanReceiptPayload {
  receiptItems: {
    lineItemId: number
    receivedQuantity: number
    remarks?: string
  }[]
  receiptRemarks?: string
}

// PORequest / POLineItemRequest
export interface POLineItemRequestPayload {
  itemId: number
  orderedQuantity: number
  unitPrice: number
  remarks?: string
}

export interface POCreateRequest {
  supplierId: number
  deliveryLocationId: number
  expectedDeliveryDate?: string
  notes?: string
  lineItems: POLineItemRequestPayload[]
}

// POReceiptRequest / POLineItemReceiptRequest
export interface POReceiptLinePayload {
  lineItemId: number
  receivedQuantity: number
  actualUnitPrice: number
  remarks?: string
}

export interface POReceiptRequestPayload {
  billNumber: string
  billDate: string
  billAmount: number
  receipts: POReceiptLinePayload[]
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
