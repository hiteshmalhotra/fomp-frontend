import { useState } from 'react'
import {
  Card,
  Descriptions,
  Tag,
  Table,
  Button,
  Typography,
  Skeleton,
  Alert,
  Space,
  Row,
  Col,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate } from '@/utils/format'
import type { ChallanLineItem } from '@/types/store.types'
import { ROUTE_PATHS } from '@/router/paths'
import { CHALLAN_STATUS_COLORS, STATUS_LABELS } from '../_shared/store.constants'
import { NEXT_ACTION, isCancellable } from './challanWorkflow'
import { useChallanDetail } from './hooks/useChallanDetail'
import LineQuantityModal from './components/LineQuantityModal'
import DispatchModal from './components/DispatchModal'
import ChallanTimeline from './components/ChallanTimeline'

const { Title, Text } = Typography

type OpenModal = 'approve' | 'pack' | 'dispatch' | 'receive' | null

const ChallanDetailPage = () => {
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const challanId = Number(id)
  usePageTitle('Transfer Challan')

  const {
    query,
    submit,
    approve,
    pack,
    dispatch,
    acknowledge,
    receive,
    verify,
    cancel,
  } = useChallanDetail(challanId)
  const challan = query.data
  const [openModal, setOpenModal] = useState<OpenModal>(null)

  const action = challan ? NEXT_ACTION[challan.status] : undefined

  const runAction = () => {
    if (!action) return
    switch (action.kind) {
      case 'submit':
        return submit.mutate()
      case 'acknowledge':
        return acknowledge.mutate()
      case 'verify':
        return verify.mutate()
      case 'approve':
        return setOpenModal('approve')
      case 'pack':
        return setOpenModal('pack')
      case 'dispatch':
        return setOpenModal('dispatch')
      case 'receive':
        return setOpenModal('receive')
    }
  }

  const actionLoading =
    submit.isPending ||
    acknowledge.isPending ||
    verify.isPending ||
    approve.isPending ||
    pack.isPending ||
    dispatch.isPending ||
    receive.isPending

  const handleCancel = () => {
    modal.confirm({
      title: 'Cancel this challan?',
      icon: <ExclamationCircleFilled />,
      content: `${challan?.challanNumber} will be cancelled. This cannot be undone.`,
      okText: 'Cancel Challan',
      okType: 'danger',
      cancelText: 'Keep',
      onOk: () => cancel.mutate('Cancelled by user'),
    })
  }

  const lineColumns: ColumnsType<ChallanLineItem> = [
    {
      title: 'Item',
      key: 'item',
      render: (_, l) => `${l.itemName} (${l.itemCode})`,
    },
    {
      title: 'Requested',
      key: 'requested',
      align: 'right',
      render: (_, l) => `${l.requestedQuantity} ${l.unitName}`,
    },
    {
      title: 'Approved',
      dataIndex: 'approvedQuantity',
      key: 'approved',
      align: 'right',
      render: (v: number | null) => v ?? '—',
    },
    {
      title: 'Dispatched',
      dataIndex: 'dispatchedQuantity',
      key: 'dispatched',
      align: 'right',
      render: (v: number | null) => v ?? '—',
    },
    {
      title: 'Received',
      key: 'received',
      align: 'right',
      render: (_, l) => (
        <span>
          {l.receivedQuantity ?? '—'}
          {l.hasShortage && (
            <Tag color="red" style={{ marginLeft: 8 }}>
              Short {l.shortageQuantity}
            </Tag>
          )}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTE_PATHS.storeChallan)}
          aria-label="Back to challans"
        />
        <Title level={1} style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          {challan ? challan.challanNumber : 'Transfer Challan'}
        </Title>
        {challan && (
          <Tag color={CHALLAN_STATUS_COLORS[challan.status]}>
            {STATUS_LABELS[challan.status] ?? challan.status}
          </Tag>
        )}
      </div>

      {query.isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : query.isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load challan"
          action={
            <Button size="small" onClick={() => query.refetch()}>
              Retry
            </Button>
          }
        />
      ) : challan ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card bordered style={{ borderRadius: 12, marginBottom: 16 }}>
                <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                  <Descriptions.Item label="Source">
                    {challan.fromLocationName} ({challan.fromLocationCode})
                  </Descriptions.Item>
                  <Descriptions.Item label="Destination">
                    {challan.toLocationName} ({challan.toLocationCode})
                  </Descriptions.Item>
                  <Descriptions.Item label="Challan Date">
                    {formatDate(challan.challanDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Expected Delivery">
                    {challan.expectedDeliveryDate
                      ? formatDate(challan.expectedDeliveryDate)
                      : '—'}
                  </Descriptions.Item>
                  {challan.vehicleNumber && (
                    <Descriptions.Item label="Vehicle">
                      {challan.vehicleNumber}
                    </Descriptions.Item>
                  )}
                  {challan.driverName && (
                    <Descriptions.Item label="Driver">
                      {challan.driverName}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              <Card
                bordered
                style={{ borderRadius: 12, marginBottom: 16 }}
                title="Line Items"
              >
                <Table
                  columns={lineColumns}
                  dataSource={challan.lineItems}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 700 }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                bordered
                style={{ borderRadius: 12 }}
                title="Status Timeline"
              >
                <ChallanTimeline challan={challan} />
              </Card>
            </Col>
          </Row>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <Text type="secondary">
              Created by {challan.createdBy} on {formatDate(challan.createdAt)}
            </Text>
            <Space>
              {isCancellable(challan.status) && (
                <Button danger onClick={handleCancel} loading={cancel.isPending}>
                  Cancel
                </Button>
              )}
              {action && (
                <Button
                  type="primary"
                  onClick={runAction}
                  loading={actionLoading}
                >
                  {action.label}
                </Button>
              )}
            </Space>
          </div>

          {/* Workflow modals */}
          <LineQuantityModal
            open={openModal === 'approve'}
            title="Approve Challan"
            confirmLabel="Approve"
            sourceLabel="Requested"
            sourceQty={(l) => l.requestedQuantity}
            lineItems={challan.lineItems}
            loading={approve.isPending}
            onCancel={() => setOpenModal(null)}
            onConfirm={(entries) =>
              approve.mutate(
                entries.map((e) => ({
                  lineItemId: e.lineItemId,
                  approvedQuantity: e.quantity,
                })),
                { onSuccess: () => setOpenModal(null) }
              )
            }
          />
          <LineQuantityModal
            open={openModal === 'pack'}
            title="Pack Challan"
            confirmLabel="Pack"
            sourceLabel="Approved"
            sourceQty={(l) => l.approvedQuantity ?? l.requestedQuantity}
            lineItems={challan.lineItems}
            loading={pack.isPending}
            onCancel={() => setOpenModal(null)}
            onConfirm={(entries, remarks) =>
              pack.mutate(
                {
                  packItems: entries.map((e) => ({
                    lineItemId: e.lineItemId,
                    packedQuantity: e.quantity,
                  })),
                  packingRemarks: remarks || undefined,
                },
                { onSuccess: () => setOpenModal(null) }
              )
            }
          />
          <LineQuantityModal
            open={openModal === 'receive'}
            title="Receive Challan"
            confirmLabel="Receive"
            sourceLabel="Dispatched"
            sourceQty={(l) =>
              l.dispatchedQuantity ?? l.packedQuantity ?? l.requestedQuantity
            }
            lineItems={challan.lineItems}
            loading={receive.isPending}
            onCancel={() => setOpenModal(null)}
            onConfirm={(entries, remarks) =>
              receive.mutate(
                {
                  receiptItems: entries.map((e) => ({
                    lineItemId: e.lineItemId,
                    receivedQuantity: e.quantity,
                  })),
                  receiptRemarks: remarks || undefined,
                },
                { onSuccess: () => setOpenModal(null) }
              )
            }
          />
          <DispatchModal
            open={openModal === 'dispatch'}
            loading={dispatch.isPending}
            onCancel={() => setOpenModal(null)}
            onConfirm={(data) =>
              dispatch.mutate(data, { onSuccess: () => setOpenModal(null) })
            }
          />
        </>
      ) : null}
    </div>
  )
}

export default ChallanDetailPage
