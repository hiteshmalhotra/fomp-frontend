import { useState } from 'react'
import { Card, Table, Tag, Switch, Button, Input, Select, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { AdminUser } from '@/types/admin.types'
import { ROLE_TAG_COLORS } from '../utils/dashboard.constants'
import styles from './UserManagementTable.module.css'
import { useToggleUserStatus } from '../hooks/useToggleUserStatus'
import CreateUserDrawer from './CreateUserDrawer'
import { Modal as AntModal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import ViewUserModal from './ViewUserModal'
import EditRoleDrawer from './EditRoleDrawer'
import { useDeleteUser } from '../hooks/useDeleteUser'

const { Title } = Typography

interface Props {
  data?: AdminUser[]
  loading: boolean
}

const UserManagementTable = ({ data, loading }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewUserId, setViewUserId] = useState<number | null>(null)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const deleteUser = useDeleteUser()

  const handleDelete = (record: AdminUser) => {
    AntModal.confirm({
      title: 'Delete this user?',
      icon: <ExclamationCircleFilled />,
      content: `${record.fullName} (${record.email}) will be permanently removed. This cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteUser.mutate(record.id),
    })
  }
  const toggleStatus = useToggleUserStatus()

  const filtered = (data ?? []).filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns: ColumnsType<AdminUser> = [
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'roleLabel',
      key: 'roleLabel',
      render: (_, record) => (
        <Tag color={ROLE_TAG_COLORS[record.role] ?? 'default'}>
          {record.roleLabel}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (val: string | null) => (val ? new Date(val).toLocaleString() : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch
        checked={enabled}
        size="small"
        loading={toggleStatus.isPending && toggleStatus.variables === record.id}
        onChange={() => toggleStatus.mutate(record.id)}/>),
    },
    {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space size={4}>
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setViewUserId(record.id)}
        />
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => setEditUser(record)}
        />
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDelete(record)}
        />
      </Space>
    ),
},]

  return (
    <Card className={styles.card} bordered>
      <div className={styles.header}>
        <Title level={5} className={styles.title}>
          User Management
        </Title>
        <Space>
          <Input
            placeholder="Search by name, email..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 240 }}
          />
          <Select defaultValue="all" style={{ width: 130 }}>
            <Select.Option value="all">All Roles</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="store">Store Manager</Select.Option>
            <Select.Option value="kitchen">Kitchen Manager</Select.Option>
            <Select.Option value="canteen">Canteen Manager</Select.Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addBtn}
            onClick={() => setDrawerOpen(true)}>
            Add User
          </Button>        
          </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 7 }}
      />
      <CreateUserDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <ViewUserModal
        userId={viewUserId}
        open={viewUserId !== null}
        onClose={() => setViewUserId(null)}
      />

      <EditRoleDrawer
        user={editUser}
        open={editUser !== null}
        onClose={() => setEditUser(null)}
      />
    </Card>
  )
}

export default UserManagementTable