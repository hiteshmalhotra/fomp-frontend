import { useState } from 'react'
import {
  Card,
  Table,
  Tag,
  Switch,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Tooltip,
  Empty,
  Alert,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import type { AdminUser } from '@/types/admin.types'
import { formatDateTime } from '@/utils/format'
import { ROLE_TAG_COLORS } from '../utils/dashboard.constants'
import { useUsers, type RoleFilter, type StatusFilter } from '../hooks/useUsers'
import { useToggleUserStatus } from '../hooks/useToggleUserStatus'
import { useDeleteUser } from '../hooks/useDeleteUser'
import CreateUserDrawer from './CreateUserDrawer'
import ViewUserModal from './ViewUserModal'
import EditRoleDrawer from './EditRoleDrawer'
import styles from './UserManagementTable.module.css'

const { Title } = Typography

const ROLE_FILTER_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: 'ALL', label: 'All Roles' },
  { value: 'ROLE_ADMIN', label: 'Admin' },
  { value: 'ROLE_STORE_MANAGER', label: 'Store Manager' },
  { value: 'ROLE_KITCHEN_MANAGER', label: 'Kitchen Manager' },
  { value: 'ROLE_CANTEEN_MANAGER', label: 'Canteen Manager' },
  { value: 'ROLE_USER', label: 'User' },
]

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const UserManagementTable = () => {
  const { modal } = App.useApp()
  const {
    query,
    searchTerm,
    roleFilter,
    statusFilter,
    page,
    size,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setPage,
    setSize,
  } = useUsers()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewUserId, setViewUserId] = useState<number | null>(null)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)

  const toggleStatus = useToggleUserStatus()
  const deleteUser = useDeleteUser()

  const handleDelete = (record: AdminUser) => {
    modal.confirm({
      title: 'Delete this user?',
      icon: <ExclamationCircleFilled />,
      content: `${record.fullName} (${record.email}) will be permanently removed. This cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteUser.mutate(record.id),
    })
  }

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
      render: (val: string | null) => (val ? formatDateTime(val) : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          size="small"
          loading={
            toggleStatus.isPending && toggleStatus.variables === record.id
          }
          onChange={() => toggleStatus.mutate(record.id)}
          aria-label={`${enabled ? 'Deactivate' : 'Activate'} ${record.fullName}`}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="View details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => setViewUserId(record.id)}
              aria-label={`View ${record.fullName}`}
            />
          </Tooltip>
          <Tooltip title="Edit role">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditUser(record)}
              aria-label={`Edit role for ${record.fullName}`}
            />
          </Tooltip>
          <Tooltip title="Delete user">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
              aria-label={`Delete ${record.fullName}`}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <Card className={styles.card} bordered>
      <div className={styles.header}>
        <Title level={5} className={styles.title}>
          User Management
        </Title>
        <Space wrap>
          <Input
            placeholder="Search by name, email..."
            prefix={<SearchOutlined style={{ color: '#64748b' }} aria-hidden="true" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 240 }}
            allowClear
            aria-label="Search users by name or email"
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            options={ROLE_FILTER_OPTIONS}
            style={{ width: 160 }}
            aria-label="Filter by role"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_FILTER_OPTIONS}
            style={{ width: 130 }}
            aria-label="Filter by status"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addBtn}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </Space>
      </div>

      {query.isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load users"
          description="The user service did not respond."
          action={
            <Button size="small" onClick={() => query.refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          dataSource={query.data?.content ?? []}
          rowKey="id"
          loading={query.isLoading || query.isFetching}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL'
                    ? 'No users match your filters'
                    : 'No users yet — add the first one'
                }
              />
            ),
          }}
          pagination={{
            current: page + 1,               // antd is 1-based, backend 0-based
            pageSize: size,
            total: query.data?.totalElements ?? 0,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (total) => `${total} users`,
            onChange: (p, s) => {
              setPage(p - 1)
              setSize(s)
            },
          }}
        />
      )}

      <CreateUserDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ViewUserModal
        userId={viewUserId}
        open={viewUserId !== null}
        onClose={() => setViewUserId(null)}
      />
      <EditRoleDrawer
        key={editUser?.id ?? 'none'}
        user={editUser}
        open={editUser !== null}
        onClose={() => setEditUser(null)}
      />
    </Card>
  )
}

export default UserManagementTable
