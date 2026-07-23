import type { ChallanStatus, POStatus, StockStatus } from '@/types/store.types'

// antd Tag preset colors per status — color is never the only indicator,
// the status text always renders beside it.
export const PO_STATUS_COLORS: Record<POStatus, string> = {
  DRAFT: 'default',
  SENT: 'blue',
  PARTIALLY_RECEIVED: 'gold',
  FULLY_RECEIVED: 'green',
  CANCELLED: 'red',
  CLOSED: 'default',
}

export const CHALLAN_STATUS_COLORS: Record<ChallanStatus, string> = {
  DRAFT: 'default',
  SUBMITTED: 'blue',
  APPROVED: 'cyan',
  PACKING: 'gold',
  DISPATCHED: 'purple',
  IN_TRANSIT: 'purple',
  RECEIVED: 'lime',
  VERIFIED: 'green',
  CLOSED: 'default',
  DISPUTED: 'red',
  CANCELLED: 'red',
}

export const STOCK_STATUS_COLORS: Record<StockStatus, string> = {
  OK: 'green',
  LOW: 'gold',
  CRITICAL: 'red',
}

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PARTIALLY_RECEIVED: 'Partially Received',
  FULLY_RECEIVED: 'Fully Received',
  CANCELLED: 'Cancelled',
  CLOSED: 'Closed',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  PACKING: 'Packing',
  DISPATCHED: 'Dispatched',
  IN_TRANSIT: 'In Transit',
  RECEIVED: 'Received',
  VERIFIED: 'Verified',
  DISPUTED: 'Disputed',
}
