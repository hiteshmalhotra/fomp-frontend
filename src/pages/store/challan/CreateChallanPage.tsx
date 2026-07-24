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
} from 'antd'
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Controller, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fieldError } from '@/utils/formA11y'
import { ROUTE_PATHS } from '@/router/paths'
import { useStoreLocations } from '../_shared/hooks/useStoreLocations'
import { useCreateChallan } from './hooks/useCreateChallan'

const { Title, Text } = Typography

const emptyLine = {
  itemId: undefined as unknown as number,
  requestedQuantity: undefined as unknown as number,
}

const CreateChallanPage = () => {
  usePageTitle('Create Transfer Challan')
  const navigate = useNavigate()
  const { locations, locationsLoading } = useStoreLocations()
  const { form, lineItems, items, availableByItem, submit, submitting } =
    useCreateChallan()
  const {
    control,
    formState: { errors },
  } = form

  const watchedLines = useWatch({ control, name: 'lineItems' }) ?? []

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
          onClick={() => navigate(ROUTE_PATHS.storeChallan)}
          aria-label="Back to challans"
        />
        <Title level={1} style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Create Transfer Challan
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
              label="Source Location"
              required
              validateStatus={errors.fromLocationId ? 'error' : ''}
              help={fieldError(errors.fromLocationId?.message)}
            >
              <Controller
                name="fromLocationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select source"
                    loading={locationsLoading}
                    options={locationOptions}
                    size="large"
                    aria-label="Source Location"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Destination Location"
              required
              validateStatus={errors.toLocationId ? 'error' : ''}
              help={fieldError(errors.toLocationId?.message)}
            >
              <Controller
                name="toLocationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select destination"
                    loading={locationsLoading}
                    options={locationOptions}
                    size="large"
                    aria-label="Destination Location"
                  />
                )}
              />
            </Form.Item>

            <Form.Item label="Transfer Date">
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
                  />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item label="Notes" style={{ marginBottom: 0 }}>
            <Controller
              name="requestRemarks"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} rows={2} placeholder="Optional notes" />
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
            <Text type="danger">{errors.lineItems.message}</Text>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '8px', minWidth: 260 }}>Item</th>
                  <th style={{ padding: '8px', width: 130, textAlign: 'right' }}>
                    Available
                  </th>
                  <th style={{ padding: '8px', width: 150 }}>Transfer Qty</th>
                  <th style={{ padding: '8px', width: 48 }} />
                </tr>
              </thead>
              <tbody>
                {lineItems.fields.map((row, index) => {
                  const itemId = watchedLines[index]?.itemId
                  const available =
                    itemId != null ? availableByItem.get(itemId) : undefined
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
                      <td
                        style={{
                          padding: '14px 8px',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {available != null ? available : '—'}
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <Form.Item
                          style={{ margin: 0 }}
                          validateStatus={
                            errors.lineItems?.[index]?.requestedQuantity
                              ? 'error'
                              : ''
                          }
                          help={fieldError(
                            errors.lineItems?.[index]?.requestedQuantity?.message
                          )}
                        >
                          <Controller
                            name={`lineItems.${index}.requestedQuantity`}
                            control={control}
                            render={({ field }) => (
                              <InputNumber
                                {...field}
                                min={0}
                                max={available}
                                style={{ width: '100%' }}
                                placeholder="0"
                                aria-label={`Transfer quantity for line ${index + 1}`}
                              />
                            )}
                          />
                        </Form.Item>
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
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => navigate(ROUTE_PATHS.storeChallan)}>
              Cancel
            </Button>
            <Button type="primary" onClick={submit} loading={submitting}>
              Save as Draft
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  )
}

export default CreateChallanPage
