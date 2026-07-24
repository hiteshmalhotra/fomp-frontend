import { useState } from 'react'
import { Modal, Table, InputNumber, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ChallanLineItem } from '@/types/store.types'

const { TextArea } = Input

interface Props {
  open: boolean
  title: string
  confirmLabel: string
  /** Column header for the reference quantity (e.g. "Requested"). */
  sourceLabel: string
  /** Reference / max quantity per line (default value + cap). */
  sourceQty: (line: ChallanLineItem) => number
  lineItems: ChallanLineItem[]
  loading: boolean
  onCancel: () => void
  onConfirm: (
    entries: { lineItemId: number; quantity: number }[],
    remarks: string
  ) => void
}

/**
 * Collects a per-line quantity (approve / pack / receive). Each input
 * defaults to the reference quantity and is capped at it (mirrors the
 * backend guards: can't approve/pack/receive more than the prior step).
 */
const LineQuantityModal = ({
  open,
  title,
  confirmLabel,
  sourceLabel,
  sourceQty,
  lineItems,
  loading,
  onCancel,
  onConfirm,
}: Props) => {
  const [qty, setQty] = useState<Record<number, number | null>>({})
  const [remarks, setRemarks] = useState('')

  // Lazily initialise defaults the first time the modal opens with data
  const valueFor = (line: ChallanLineItem): number | null =>
    qty[line.id] ?? sourceQty(line)

  const handleConfirm = () => {
    const entries = lineItems.map((l) => ({
      lineItemId: l.id,
      quantity: valueFor(l) ?? 0,
    }))
    onConfirm(entries, remarks.trim())
  }

  const columns: ColumnsType<ChallanLineItem> = [
    {
      title: 'Item',
      key: 'item',
      render: (_, l) => `${l.itemName} (${l.itemCode})`,
    },
    {
      title: sourceLabel,
      key: 'source',
      align: 'right',
      render: (_, l) => `${sourceQty(l)} ${l.unitName}`,
    },
    {
      title: 'Quantity',
      key: 'qty',
      width: 150,
      render: (_, l) => (
        <InputNumber
          min={0}
          max={sourceQty(l)}
          value={valueFor(l)}
          onChange={(v) => setQty((prev) => ({ ...prev, [l.id]: v }))}
          style={{ width: '100%' }}
          aria-label={`Quantity for ${l.itemName}`}
        />
      ),
    },
  ]

  return (
    <Modal
      open={open}
      title={title}
      okText={confirmLabel}
      onOk={handleConfirm}
      confirmLoading={loading}
      onCancel={onCancel}
      width={640}
      destroyOnHidden
    >
      <Table
        columns={columns}
        dataSource={lineItems}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 500 }}
      />
      <TextArea
        rows={2}
        placeholder="Remarks (optional)"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        style={{ marginTop: 16 }}
      />
    </Modal>
  )
}

export default LineQuantityModal
