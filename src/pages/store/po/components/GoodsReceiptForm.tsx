import { useMemo, useState } from 'react'
import {
  Table,
  InputNumber,
  Input,
  DatePicker,
  Button,
  Typography,
  Space,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { formatCurrency } from '@/utils/format'
import type {
  POLineItem,
  POReceiptRequestPayload,
} from '@/types/store.types'

const { Text } = Typography

interface GrnLineState {
  receivedQuantity: number | null
  actualUnitPrice: number | null
}

interface Props {
  lineItems: POLineItem[]
  submitting: boolean
  onRecord: (payload: POReceiptRequestPayload) => void
}

/**
 * Inline GRN form (STORE-008). Each not-yet-fully-received line gets a
 * "Received This GRN" input capped at pending qty (BR-002 no over-receive)
 * plus an actual unit price defaulting to the ordered price.
 */
const GoodsReceiptForm = ({ lineItems, submitting, onRecord }: Props) => {
  const { message } = App.useApp()
  const [billNumber, setBillNumber] = useState('')
  const [billDate, setBillDate] = useState<string>('')
  const [lines, setLines] = useState<Record<number, GrnLineState>>(() =>
    Object.fromEntries(
      lineItems.map((l) => [
        l.id,
        { receivedQuantity: null, actualUnitPrice: l.unitPrice },
      ])
    )
  )

  const setLine = (id: number, patch: Partial<GrnLineState>) =>
    setLines((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const billAmount = useMemo(
    () =>
      lineItems.reduce((sum, l) => {
        const s = lines[l.id]
        return sum + (s?.receivedQuantity ?? 0) * (s?.actualUnitPrice ?? 0)
      }, 0),
    [lineItems, lines]
  )

  const openLines = lineItems.filter((l) => !l.fullyReceived)

  const handleRecord = () => {
    const receipts = openLines
      .map((l) => ({ line: l, state: lines[l.id] }))
      .filter(({ state }) => (state?.receivedQuantity ?? 0) > 0)
      .map(({ line, state }) => ({
        lineItemId: line.id,
        receivedQuantity: state.receivedQuantity as number,
        actualUnitPrice: (state.actualUnitPrice ?? line.unitPrice) as number,
      }))

    if (receipts.length === 0) {
      message.warning('Enter a received quantity for at least one item.')
      return
    }
    // Client-side guard mirrors backend BR-002
    const over = receipts.find((r) => {
      const line = openLines.find((l) => l.id === r.lineItemId)!
      return r.receivedQuantity > line.pendingQuantity
    })
    if (over) {
      message.error('Received quantity cannot exceed pending quantity.')
      return
    }
    if (!billNumber.trim() || !billDate) {
      message.warning('Bill number and bill date are required.')
      return
    }

    onRecord({
      billNumber: billNumber.trim(),
      billDate,
      billAmount,
      receipts,
    })
  }

  const columns: ColumnsType<POLineItem> = [
    {
      title: 'Item',
      key: 'item',
      render: (_, l) => `${l.itemName} (${l.itemCode})`,
    },
    {
      title: 'Ordered',
      key: 'ordered',
      align: 'right',
      render: (_, l) => `${l.orderedQuantity} ${l.unitName}`,
    },
    {
      title: 'Previously Received',
      dataIndex: 'receivedQuantity',
      key: 'receivedQuantity',
      align: 'right',
    },
    { title: 'Pending', dataIndex: 'pendingQuantity', key: 'pending', align: 'right' },
    {
      title: 'Received This GRN',
      key: 'grnQty',
      width: 150,
      render: (_, l) => (
        <InputNumber
          min={0}
          max={l.pendingQuantity}
          value={lines[l.id]?.receivedQuantity ?? null}
          onChange={(v) => setLine(l.id, { receivedQuantity: v })}
          style={{ width: '100%' }}
          aria-label={`Received this GRN for ${l.itemName}`}
        />
      ),
    },
    {
      title: 'Actual Unit Price',
      key: 'actualPrice',
      width: 150,
      render: (_, l) => (
        <InputNumber
          min={0}
          step={0.01}
          prefix="₹"
          value={lines[l.id]?.actualUnitPrice ?? null}
          onChange={(v) => setLine(l.id, { actualUnitPrice: v })}
          style={{ width: '100%' }}
          aria-label={`Actual unit price for ${l.itemName}`}
        />
      ),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={openLines}
        rowKey="id"
        pagination={false}
        scroll={{ x: 900 }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 20,
        }}
      >
        <Space wrap align="end">
          <label>
            <div style={{ marginBottom: 4 }}>
              Bill Number <Text type="danger">*</Text>
            </div>
            <Input
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="Supplier bill no."
              style={{ width: 180 }}
              aria-label="Bill number"
            />
          </label>
          <label>
            <div style={{ marginBottom: 4 }}>
              Bill Date <Text type="danger">*</Text>
            </div>
            <DatePicker
              value={billDate ? dayjs(billDate) : null}
              onChange={(d) => setBillDate(d ? d.format('YYYY-MM-DD') : '')}
              disabledDate={(d) => d.isAfter(dayjs(), 'day')}
              aria-label="Bill date"
            />
          </label>
          <div>
            <div style={{ marginBottom: 4 }}>Bill Amount</div>
            <Text strong style={{ fontSize: 16 }}>
              {formatCurrency(billAmount)}
            </Text>
          </div>
        </Space>

        <Button
          type="primary"
          onClick={handleRecord}
          loading={submitting}
        >
          Record Receipt
        </Button>
      </div>
    </div>
  )
}

export default GoodsReceiptForm
