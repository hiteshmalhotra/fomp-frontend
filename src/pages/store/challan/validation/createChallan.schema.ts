import { z } from 'zod'

export const challanLineSchema = z.object({
  itemId: z
    .number({ error: 'Item is required' })
    .int()
    .positive('Item is required'),
  requestedQuantity: z
    .number({ error: 'Quantity is required' })
    .positive('Quantity must be greater than 0'),
  remarks: z.string().optional(),
})

export const createChallanSchema = z
  .object({
    fromLocationId: z
      .number({ error: 'Source location is required' })
      .int()
      .positive('Source location is required'),
    toLocationId: z
      .number({ error: 'Destination location is required' })
      .int()
      .positive('Destination location is required'),
    expectedDeliveryDate: z.string().optional(),
    requestRemarks: z.string().optional(),
    lineItems: z
      .array(challanLineSchema)
      .min(1, 'At least one line item is required'),
  })
  // BR-001: source and destination cannot be the same
  .refine((d) => d.fromLocationId !== d.toLocationId, {
    message: 'Source and destination must be different',
    path: ['toLocationId'],
  })

export type CreateChallanFormValues = z.infer<typeof createChallanSchema>
