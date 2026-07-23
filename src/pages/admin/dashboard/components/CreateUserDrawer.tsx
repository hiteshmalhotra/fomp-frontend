import { Drawer, Form, Input, Select, Button } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import { Controller } from 'react-hook-form'
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator'
import { useCreateUser } from '../hooks/useCreateUser'
import { ROLE_LABELS } from '@/utils/constants'
import styles from './CreateUserDrawer.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

const ROLE_OPTIONS = (
  ['ROLE_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_KITCHEN_MANAGER', 'ROLE_CANTEEN_MANAGER', 'ROLE_USER'] as const
).map((value) => ({ value, label: ROLE_LABELS[value] }))

const CreateUserDrawer = ({ open, onClose }: Props) => {
  const { form, onSubmit, loading } = useCreateUser(onClose)
  const { control, formState: { errors }, watch } = form
  const passwordValue = watch('password')

  return (
    <Drawer
      title="Add New User"
      open={open}
      onClose={onClose}
      width={440}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <div className={styles.nameRow}>
          <Form.Item
            label={<span className={styles.label}>First Name</span>}
            validateStatus={errors.firstName ? 'error' : ''}
            help={errors.firstName?.message}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input {...field} prefix={<UserOutlined />} placeholder="First name" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className={styles.label}>Last Name</span>}
            validateStatus={errors.lastName ? 'error' : ''}
            help={errors.lastName?.message}
          >
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input {...field} prefix={<UserOutlined />} placeholder="Last name" size="large" />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className={styles.label}>Email Address</span>}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} prefix={<MailOutlined />} placeholder="you@company.com" size="large" autoComplete="off" />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className={styles.label}>Role</span>}
          validateStatus={errors.role ? 'error' : ''}
          help={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select {...field} size="large" options={ROLE_OPTIONS} />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className={styles.label}>Password</span>}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
          style={{ marginBottom: 8 }}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="Create a strong password"
                size="large"
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone twoToneColor="#1e40af" /> : <EyeInvisibleOutlined />
                }
              />
            )}
          />
        </Form.Item>

        <div style={{ marginBottom: 20 }}>
          <PasswordStrengthIndicator password={passwordValue ?? ''} />
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create User
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

export default CreateUserDrawer