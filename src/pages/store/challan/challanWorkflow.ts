import type { ChallanStatus } from '@/types/store.types'

/**
 * STORE-011 BR-001: only the valid next-status action is shown.
 * kind drives how the action is collected:
 *  - simple: single click (optionally confirmed)
 *  - approve/pack/receive: per-line quantity modal
 *  - dispatch: vehicle/driver modal
 */
export type ActionKind =
  | 'submit'
  | 'approve'
  | 'pack'
  | 'dispatch'
  | 'acknowledge'
  | 'receive'
  | 'verify'

export interface NextAction {
  kind: ActionKind
  label: string
}

// VERIFIED is terminal in the manager UI (matches the spec's button set,
// which ends at Verify). CLOSED/CANCELLED/DISPUTED have no next action.
export const NEXT_ACTION: Partial<Record<ChallanStatus, NextAction>> = {
  DRAFT: { kind: 'submit', label: 'Submit for Approval' },
  SUBMITTED: { kind: 'approve', label: 'Approve' },
  APPROVED: { kind: 'pack', label: 'Pack' },
  PACKING: { kind: 'dispatch', label: 'Dispatch' },
  DISPATCHED: { kind: 'acknowledge', label: 'Mark In Transit' },
  IN_TRANSIT: { kind: 'receive', label: 'Receive' },
  RECEIVED: { kind: 'verify', label: 'Verify' },
}

// Cancel is allowed only before stock leaves the source (before DISPATCHED).
const CANCELLABLE: ChallanStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'PACKING',
]

export const isCancellable = (status: ChallanStatus): boolean =>
  CANCELLABLE.includes(status)
