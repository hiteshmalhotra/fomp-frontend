import { z } from 'zod'

export const poLineItemSchema = z.object({
  itemId: z
    .number({ error: 'Item is required' })
    .int()
    .positive('Item is required'),
  orderedQuantity: z
    .number({ error: 'Quantity is required' })
    .positive('Quantity must be greater than 0'),
  unitPrice: z
    .number({ error: 'Unit price is required' })
    .positive('Unit price must be greater than 0'),
  remarks: z.string().optional(),
})

export const createPoSchema = z.object({
  supplierId: z
    .number({ error: 'Supplier is required' })
    .int()
    .positive('Supplier is required'),
  deliveryLocationId: z
    .number({ error: 'Delivery location is required' })
    .int()
    .positive('Delivery location is required'),
  expectedDeliveryDate: z
    .string({ error: 'Expected delivery date is required' })
    .min(1, 'Expected delivery date is required'),
  notes: z.string().optional(),
  lineItems: z
    .array(poLineItemSchema)
    .min(1, 'At least one line item is required'),
})

export type CreatePoFormValues = z.infer<typeof createPoSchema>
