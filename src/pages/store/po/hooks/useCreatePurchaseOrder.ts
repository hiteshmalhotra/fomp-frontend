import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { storeApi } from '@/api/store.api'
import { getApiError } from '@/utils/apiError'
import { storePoDetail } from '@/router/paths'
import {
  createPoSchema,
  type CreatePoFormValues,
} from '../validation/createPo.schema'

/**
 * STORE-007 Create PO. "Save as Draft" creates the PO (DRAFT).
 * "Send PO" creates then transitions to SENT (fires the Kafka event).
 * Both navigate to the new PO's detail page (STORE-008) on success.
 */
export const useCreatePurchaseOrder = () => {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreatePoFormValues>({
    resolver: zodResolver(createPoSchema),
    defaultValues: {
      supplierId: undefined as unknown as number,
      deliveryLocationId: undefined as unknown as number,
      expectedDeliveryDate: '',
      notes: '',
      lineItems: [
        {
          itemId: undefined as unknown as number,
          orderedQuantity: undefined as unknown as number,
          unitPrice: undefined as unknown as number,
        },
      ],
    },
  })

  const lineItems = useFieldArray({
    control: form.control,
    name: 'lineItems',
  })

  const suppliers = useQuery({
    queryKey: ['store', 'suppliers'],
    queryFn: ({ signal }) => storeApi.getSuppliers(signal),
    staleTime: 1000 * 60 * 30,
  })

  const items = useQuery({
    queryKey: ['store', 'items-lookup'],
    queryFn: ({ signal }) => storeApi.getItems(signal),
    staleTime: 1000 * 60 * 30,
  })

  const mutation = useMutation({
    mutationFn: async ({
      values,
      send,
    }: {
      values: CreatePoFormValues
      send: boolean
    }) => {
      const created = await storeApi.createPO({
        supplierId: values.supplierId,
        deliveryLocationId: values.deliveryLocationId,
        expectedDeliveryDate: values.expectedDeliveryDate,
        notes: values.notes || undefined,
        lineItems: values.lineItems.map((l) => ({
          itemId: l.itemId,
          orderedQuantity: l.orderedQuantity,
          unitPrice: l.unitPrice,
          remarks: l.remarks || undefined,
        })),
      })
      if (send) {
        return storeApi.sendPO(created.id)
      }
      return created
    },
    onSuccess: (po, variables) => {
      queryClient.invalidateQueries({ queryKey: ['store', 'po-list'] })
      message.success(
        variables.send
          ? `PO ${po.poNumber} created and sent.`
          : `PO ${po.poNumber} saved as draft.`
      )
      navigate(storePoDetail(po.id), { replace: true })
    },
    onError: (err: unknown) => {
      message.error(
        getApiError(err).message ?? 'Failed to save purchase order.'
      )
    },
  })

  const submit = (send: boolean) =>
    form.handleSubmit(async (values) => {
      setSubmitting(true)
      try {
        await mutation.mutateAsync({ values, send })
      } finally {
        setSubmitting(false)
      }
    })

  return { form, lineItems, suppliers, items, submit, submitting }
}
