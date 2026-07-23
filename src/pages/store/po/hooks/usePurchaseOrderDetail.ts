import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { storeApi } from '@/api/store.api'
import { getApiError } from '@/utils/apiError'
import type { POReceiptRequestPayload } from '@/types/store.types'

/**
 * STORE-008 PO detail + goods receipt.
 * receive() records a GRN; cancel() cancels a DRAFT/SENT PO.
 * Both refresh the detail and the list on success.
 */
export const usePurchaseOrderDetail = (id: number) => {
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['store', 'po', id],
    queryFn: ({ signal }) => storeApi.getPO(id, signal),
    enabled: Number.isFinite(id),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['store', 'po', id] })
    queryClient.invalidateQueries({ queryKey: ['store', 'po-list'] })
    queryClient.invalidateQueries({ queryKey: ['store', 'dashboard-summary'] })
  }

  const receive = useMutation({
    mutationFn: (payload: POReceiptRequestPayload) =>
      storeApi.receivePO(id, payload),
    onSuccess: (po) => {
      message.success(`Goods receipt recorded for ${po.poNumber}.`)
      invalidate()
    },
    onError: (err: unknown) => {
      // Backend returns 400 with a clear over-receive message
      message.error(getApiError(err).message ?? 'Failed to record receipt.')
    },
  })

  const cancel = useMutation({
    mutationFn: (reason: string) => storeApi.cancelPO(id, reason),
    onSuccess: (po) => {
      message.success(`PO ${po.poNumber} cancelled.`)
      invalidate()
    },
    onError: (err: unknown) => {
      message.error(getApiError(err).message ?? 'Failed to cancel PO.')
    },
  })

  return { query, receive, cancel }
}
