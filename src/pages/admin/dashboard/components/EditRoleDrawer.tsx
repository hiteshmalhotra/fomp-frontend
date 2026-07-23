import { useState } from 'react'
import { Drawer, Form, Select, Button } from 'antd'
import { useChangeRole } from '../hooks/useChangeRole'
import { ROLE_LABELS } from '@/utils/constants'
import type { AdminUser } from '@/types/admin.types'
import type { UserRole } from '@/types/auth.types'

interface Props {
  user: AdminUser | null
  open: boolean
  onClose: () => void
}

const ROLE_OPTIONS = (
  ['ROLE_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_KITCHEN_MANAGER', 'ROLE_CANTEEN_MANAGER', 'ROLE_USER'] as const
).map((value) => ({ value, label: ROLE_LABELS[value] }))

/**
 * NOTE: the parent must pass key={user?.id} so this remounts per user —
 * state initialises from the prop without a sync-from-props effect.
 */
const EditRoleDrawer = ({ user, open, onClose }: Props) => {
  const [role, setRole] = useState<UserRole | undefined>(user?.role)
  const mutation = useChangeRole(onClose)

  const handleSubmit = () => {
    if (!user || !role) return
    mutation.mutate({ id: user.id, role })
  }

  return (
    <Drawer
      title={`Edit Role — ${user?.fullName ?? ''}`}
      open={open}
      onClose={onClose}
      width={360}
    >
      <Form layout="vertical">
        <Form.Item label="Role">
          <Select
            value={role}
            onChange={setRole}
            options={ROLE_OPTIONS}
            size="large"
            aria-label="Select role"
          />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            loading={mutation.isPending}
            disabled={role === user?.role}
            onClick={handleSubmit}
          >
            Update Role
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

export default EditRoleDrawer
