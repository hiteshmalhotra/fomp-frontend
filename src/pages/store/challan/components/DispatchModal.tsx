import { useState } from 'react'
import { Modal, Form, Input } from 'antd'
import type { ChallanDispatchPayload } from '@/types/store.types'

interface Props {
  open: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: (data: ChallanDispatchPayload) => void
}

/** Dispatch collects transport details; dispatching deducts source stock. */
const DispatchModal = ({ open, loading, onCancel, onConfirm }: Props) => {
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [driverName, setDriverName] = useState('')
  const [dispatchRemarks, setDispatchRemarks] = useState('')

  return (
    <Modal
      open={open}
      title="Dispatch Challan"
      okText="Dispatch"
      onOk={() =>
        onConfirm({
          vehicleNumber: vehicleNumber.trim() || undefined,
          driverName: driverName.trim() || undefined,
          dispatchRemarks: dispatchRemarks.trim() || undefined,
        })
      }
      confirmLoading={loading}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item label="Vehicle Number">
          <Input
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="e.g. MH12AB1234"
          />
        </Form.Item>
        <Form.Item label="Driver Name">
          <Input
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Driver's name"
          />
        </Form.Item>
        <Form.Item label="Remarks" style={{ marginBottom: 0 }}>
          <Input.TextArea
            rows={2}
            value={dispatchRemarks}
            onChange={(e) => setDispatchRemarks(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DispatchModal
