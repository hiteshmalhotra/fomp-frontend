import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { storeApi } from '@/api/store.api'
import { getApiError } from '@/utils/apiError'
import type {
  ChallanApprovalPayload,
  ChallanDispatchPayload,
  ChallanPackPayload,
  ChallanReceiptPayload,
} from '@/types/store.types'

/**
 * STORE-011 challan detail + full workflow. Each transition is its own
 * mutation; all refresh the detail + list + dashboard on success and
 * surface the backend's clear 400 messages (invalid transition, shortage).
 */
export const useChallanDetail = (id: number) => {
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['store', 'challan', id],
    queryFn: ({ signal }) => storeApi.getChallan(id, signal),
    enabled: Number.isFinite(id),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['store', 'challan', id] })
    queryClient.invalidateQueries({ queryKey: ['store', 'challan-list'] })
    queryClient.invalidateQueries({ queryKey: ['store', 'dashboard-summary'] })
  }

  const onError = (err: unknown) =>
    message.error(getApiError(err).message ?? 'Action failed. Please try again.')

  const onOk = (successMsg: string) => () => {
    message.success(successMsg)
    invalidate()
  }

  const submit = useMutation({
    mutationFn: () => storeApi.submitChallan(id),
    onSuccess: onOk('Challan submitted.'),
    onError,
  })
  const approve = useMutation({
    mutationFn: (approvals: ChallanApprovalPayload[]) =>
      storeApi.approveChallan(id, approvals),
    onSuccess: onOk('Challan approved.'),
    onError,
  })
  const pack = useMutation({
    mutationFn: (data: ChallanPackPayload) => storeApi.packChallan(id, data),
    onSuccess: onOk('Challan packed.'),
    onError,
  })
  const dispatch = useMutation({
    mutationFn: (data: ChallanDispatchPayload) =>
      storeApi.dispatchChallan(id, data),
    onSuccess: onOk('Challan dispatched — stock deducted from source.'),
    onError,
  })
  const acknowledge = useMutation({
    mutationFn: () => storeApi.acknowledgeChallan(id),
    onSuccess: onOk('Marked in transit.'),
    onError,
  })
  const receive = useMutation({
    mutationFn: (data: ChallanReceiptPayload) =>
      storeApi.receiveChallan(id, data),
    onSuccess: onOk('Challan received — stock credited to destination.'),
    onError,
  })
  const verify = useMutation({
    mutationFn: () => storeApi.verifyChallan(id),
    onSuccess: onOk('Challan verified.'),
    onError,
  })
  const cancel = useMutation({
    mutationFn: (reason: string) => storeApi.cancelChallan(id, reason),
    onSuccess: onOk('Challan cancelled.'),
    onError,
  })

  return {
    query,
    submit,
    approve,
    pack,
    dispatch,
    acknowledge,
    receive,
    verify,
    cancel,
  }
}
