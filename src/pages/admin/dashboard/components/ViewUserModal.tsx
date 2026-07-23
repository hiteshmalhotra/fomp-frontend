import { Modal, Descriptions, Tag, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'
import { ROLE_TAG_COLORS } from '../utils/dashboard.constants'

interface Props {
  userId: number | null
  open: boolean
  onClose: () => void
}

const ViewUserModal = ({ userId, open, onClose }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminApi.getUserById(userId as number),
    enabled: !!userId && open,
  })

  return (
    <Modal title="User Details" open={open} onCancel={onClose} footer={null}>
      {isLoading ? (
        <Spin />
      ) : data ? (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Full Name">{data.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={ROLE_TAG_COLORS[data.role] ?? 'default'}>
              {data.roleLabel}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={data.enabled ? 'green' : 'default'}>
              {data.enabled ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(data.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Login">
            {data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : '—'}
          </Descriptions.Item>
        </Descriptions>
      ) : null}
    </Modal>
  )
}

export default ViewUserModal