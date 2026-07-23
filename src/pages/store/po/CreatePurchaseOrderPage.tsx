import {
  Card,
  Form,
  Select,
  DatePicker,
  Input,
  InputNumber,
  Button,
  Typography,
  Space,
  Divider,
  Alert,
} from 'antd'
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Controller, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fieldError } from '@/utils/formA11y'
import { formatCurrency } from '@/utils/format'
import { ROUTE_PATHS } from '@/router/paths'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import { useCreatePurchaseOrder } from './hooks/useCreatePurchaseOrder'

const { Title, Text } = Typography

const emptyLine = {
  itemId: undefined as unknown as number,
  orderedQuantity: undefined as unknown as number,
  unitPrice: undefined as unknown as number,
}

const CreatePurchaseOrderPage = () => {
  usePageTitle('Create Purchase Order')
  const navigate = useNavigate()
  const { locations, locationsLoading } = useStoreLocations()
  const { form, lineItems, suppliers, items, submit, submitting } =
    useCreatePurchaseOrder()
  const {
    control,
    formState: { errors },
  } = form

  // Live order total
  const watchedLines = useWatch({ control, name: 'lineItems' }) ?? []
  const orderTotal = watchedLines.reduce(
    (sum, l) => sum + (l?.orderedQuantity ?? 0) * (l?.unitPrice ?? 0),
    0
  )

  const supplierOptions = (suppliers.data ?? [])
    .filter((s) => s.active)
    .map((s) => ({ value: s.id, label: `${s.name} (${s.supplierCode})` }))

  const itemOptions = (items.data ?? []).map((i) => ({
    value: i.id,
    label: `${i.name} (${i.itemCode})`,
  }))

  const locationOptions = locations
    .filter((l) => l.active)
    .map((l) => ({ value: l.id, label: `${l.name} (${l.locationCode})` }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTE_PATHS.storePo)}
          aria-label="Back to purchase orders"
        />
        <Title level={1} style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Create Purchase Order
        </Title>
      </div>

      <Form layout="vertical">
        <Card bordered style={{ borderRadius: 12, marginBottom: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            <Form.Item
              label="Supplier"
              required
              validateStatus={errors.supplierId ? 'error' : ''}
              help={fieldError(errors.supplierId?.message)}
            >
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select supplier"
                    loading={suppliers.isLoading}
                    options={supplierOptions}
                    size="large"
                    aria-label="Supplier"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Delivery Location"
              required
              validateStatus={errors.deliveryLocationId ? 'error' : ''}
              help={fieldError(errors.deliveryLocationId?.message)}
            >
              <Controller
                name="deliveryLocationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select location"
                    loading={locationsLoading}
                    options={locationOptions}
                    size="large"
                    aria-label="Delivery Location"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Expected Delivery Date"
              required
              validateStatus={errors.expectedDeliveryDate ? 'error' : ''}
              help={fieldError(errors.expectedDeliveryDate?.message)}
            >
              <Controller
                name="expectedDeliveryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(d) =>
                      field.onChange(d ? d.format('YYYY-MM-DD') : '')
                    }
                    disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                  />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item label="Notes / Remarks" style={{ marginBottom: 0 }}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={2}
                  placeholder="Optional notes for this order"
                />
              )}
            />
          </Form.Item>
        </Card>

        {/* Line items */}
        <Card
          bordered
          style={{ borderRadius: 12, marginBottom: 16 }}
          title="Line Items"
          extra={
            <Button
              icon={<PlusOutlined />}
              onClick={() => lineItems.append({ ...emptyLine })}
            >
              Add Item
            </Button>
          }
        >
          {typeof errors.lineItems?.message === 'string' && (
            <Alert
              type="warning"
              showIcon
              message={errors.lineItems.message}
              style={{ marginBottom: 16 }}
            />
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '8px 8px', minWidth: 240 }}>Item</th>
                  <th style={{ padding: '8px 8px', width: 130 }}>Quantity</th>
                  <th style={{ padding: '8px 8px', width: 150 }}>Unit Price</th>
                  <th style={{ padding: '8px 8px', width: 130, textAlign: 'right' }}>
                    Line Total
                  </th>
                  <th style={{ padding: '8px 8px', width: 48 }} />
                </tr>
              </thead>
              <tbody>
                {lineItems.fields.map((row, index) => {
                  const line = watchedLines[index]
                  const lineTotal =
                    (line?.orderedQuantity ?? 0) * (line?.unitPrice ?? 0)
                  return (
                    <tr key={row.id} style={{ verticalAlign: 'top' }}>
                      <td style={{ padding: '6px 8px' }}>
                        <Form.Item
                          style={{ margin: 0 }}
                          validateStatus={
                            errors.lineItems?.[index]?.itemId ? 'error' : ''
                          }
                          help={fieldError(
                            errors.lineItems?.[index]?.itemId?.message
                          )}
                        >
                          <Controller
                            name={`lineItems.${index}.itemId`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                showSearch
                                optionFilterProp="label"
                                placeholder="Select item"
                                loading={items.isLoading}
                                options={itemOptions}
                                style={{ width: '100%' }}
                                aria-label={`Item for line ${index + 1}`}
                              />
                            )}
                          />
                        </Form.Item>
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <Form.Item
                          style={{ margin: 0 }}
                          validateStatus={
                            errors.lineItems?.[index]?.orderedQuantity
                              ? 'error'
                              : ''
                          }
                          help={fieldError(
                            errors.lineItems?.[index]?.orderedQuantity?.message
                          )}
                        >
                          <Controller
                            name={`lineItems.${index}.orderedQuantity`}
                            control={control}
                            render={({ field }) => (
                              <InputNumber
                                {...field}
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="0"
                                aria-label={`Quantity for line ${index + 1}`}
                              />
                            )}
                          />
                        </Form.Item>
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <Form.Item
                          style={{ margin: 0 }}
                          validateStatus={
                            errors.lineItems?.[index]?.unitPrice ? 'error' : ''
                          }
                          help={fieldError(
                            errors.lineItems?.[index]?.unitPrice?.message
                          )}
                        >
                          <Controller
                            name={`lineItems.${index}.unitPrice`}
                            control={control}
                            render={({ field }) => (
                              <InputNumber
                                {...field}
                                min={0}
                                step={0.01}
                                prefix="₹"
                                style={{ width: '100%' }}
                                placeholder="0.00"
                                aria-label={`Unit price for line ${index + 1}`}
                              />
                            )}
                          />
                        </Form.Item>
                      </td>
                      <td
                        style={{
                          padding: '14px 8px',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatCurrency(lineTotal)}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          disabled={lineItems.fields.length === 1}
                          onClick={() => lineItems.remove(index)}
                          aria-label={`Remove line ${index + 1}`}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <div style={{ textAlign: 'right' }}>
            <Text type="secondary" style={{ marginRight: 12 }}>
              Order Total
            </Text>
            <Text strong style={{ fontSize: 18 }}>
              {formatCurrency(orderTotal)}
            </Text>
          </div>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => navigate(ROUTE_PATHS.storePo)}>Cancel</Button>
            <Button onClick={submit(false)} loading={submitting}>
              Save as Draft
            </Button>
            <Button type="primary" onClick={submit(true)} loading={submitting}>
              Send PO
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  )
}

export default CreatePurchaseOrderPage
