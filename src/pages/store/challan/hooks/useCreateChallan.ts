import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { storeApi } from '@/api/store.api'
import { getApiError } from '@/utils/apiError'
import { storeChallanDetail } from '@/router/paths'
import {
  createChallanSchema,
  type CreateChallanFormValues,
} from '../validation/createChallan.schema'

/**
 * STORE-010 Create Transfer Challan. Creates as DRAFT.
 * Available-qty per item is looked up from the source location's stock
 * (client-side hint; the backend re-validates on dispatch, BR-002).
 */
export const useCreateChallan = () => {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<CreateChallanFormValues>({
    resolver: zodResolver(createChallanSchema),
    defaultValues: {
      fromLocationId: undefined as unknown as number,
      toLocationId: undefined as unknown as number,
      expectedDeliveryDate: '',
      requestRemarks: '',
      lineItems: [
        {
          itemId: undefined as unknown as number,
          requestedQuantity: undefined as unknown as number,
        },
      ],
    },
  })

  const lineItems = useFieldArray({
    control: form.control,
    name: 'lineItems',
  })

  const fromLocationId = useWatch({ control: form.control, name: 'fromLocationId' })

  const items = useQuery({
    queryKey: ['store', 'items-lookup'],
    queryFn: ({ signal }) => storeApi.getItems(signal),
    staleTime: 1000 * 60 * 30,
  })

  // Available stock at the chosen source — drives the read-only "Available"
  const sourceStock = useQuery({
    queryKey: ['store', 'stock-by-location', fromLocationId],
    queryFn: ({ signal }) =>
      storeApi.getStockByLocation(fromLocationId as number, signal),
    enabled: Number.isFinite(fromLocationId) && fromLocationId > 0,
  })

  const availableByItem = new Map<number, number>(
    (sourceStock.data ?? []).map((s) => [s.itemId, s.quantity])
  )

  const mutation = useMutation({
    mutationFn: (values: CreateChallanFormValues) =>
      storeApi.createChallan({
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        expectedDeliveryDate: values.expectedDeliveryDate || undefined,
        requestRemarks: values.requestRemarks || undefined,
        lineItems: values.lineItems.map((l) => ({
          itemId: l.itemId,
          requestedQuantity: l.requestedQuantity,
          remarks: l.remarks || undefined,
        })),
      }),
    onSuccess: (challan) => {
      queryClient.invalidateQueries({ queryKey: ['store', 'challan-list'] })
      message.success(`Challan ${challan.challanNumber} saved as draft.`)
      navigate(storeChallanDetail(challan.id), { replace: true })
    },
    onError: (err: unknown) => {
      message.error(getApiError(err).message ?? 'Failed to create challan.')
    },
  })

  const submit = form.handleSubmit((values) => mutation.mutate(values))

  return {
    form,
    lineItems,
    items,
    availableByItem,
    submit,
    submitting: mutation.isPending,
  }
}
