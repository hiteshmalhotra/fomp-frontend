import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
} from 'antd'
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import { Controller, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '@/pages/auth/_shared/AuthLayout'
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator'
import { useRegister } from './hooks/useRegister'
import shared from '@/pages/auth/_shared/auth.module.css'
import styles from './RegisterPage.module.css'

const { Title, Text } = Typography

const RegisterPage = () => {
  const { form, loading, onSubmit } = useRegister()
  const { control, formState: { errors } } = form

  const passwordValue = useWatch({ control, name: 'password' })

  return (
    <AuthLayout
      navRight={
        <>
          <Link to="/login" className={shared.navLink}>
            Already have an account?
          </Link>
        </>
      }
    >
      {/* Header */}
      <div className={shared.cardHeader}>
        <div className={shared.cardLogoWrap}>
          <span className={shared.cardLogoIcon}>🍽</span>
        </div>
        <Title level={2} className={shared.cardTitle}>
          Create Your Account
        </Title>
        <Text className={shared.cardSubtitle}>
          Register to access inventory, operations, and reporting tools.
        </Text>
      </div>

      <Divider className={shared.divider} />

      <Form
        layout="vertical"
        onFinish={onSubmit}
        autoComplete="off"
      >
        {/* First + Last name */}
        <div className={styles.nameRow}>
          <Form.Item
            label={<span className={shared.label}>First Name</span>}
            validateStatus={errors.firstName ? 'error' : ''}
            help={errors.firstName?.message}
            style={{ marginBottom: 20 }}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined className={shared.inputIcon} />}
                  placeholder="First name"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className={shared.label}>Last Name</span>}
            validateStatus={errors.lastName ? 'error' : ''}
            help={errors.lastName?.message}
            style={{ marginBottom: 20 }}
          >
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined className={shared.inputIcon} />}
                  placeholder="Last name"
                  size="large"
                />
              )}
            />
          </Form.Item>
        </div>

        {/* Email */}
        <Form.Item
          label={<span className={shared.label}>Email Address</span>}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
          style={{ marginBottom: 20 }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined className={shared.inputIcon} />}
                placeholder="you@company.com"
                size="large"
                autoComplete="email"
              />
            )}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label={<span className={shared.label}>Password</span>}
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
                prefix={<LockOutlined className={shared.inputIcon} />}
                placeholder="Create a strong password"
                size="large"
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#1A7A6E" />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: '#5A7A84' }} />
                  )
                }
              />
            )}
          />
        </Form.Item>

        {/* Password strength */}
        <div style={{ marginBottom: 20 }}>
          <PasswordStrengthIndicator password={passwordValue ?? ''} />
        </div>

        {/* Confirm password */}
        <Form.Item
          label={<span className={shared.label}>Confirm Password</span>}
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
          style={{ marginBottom: 24 }}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined className={shared.inputIcon} />}
                placeholder="Re-enter your password"
                size="large"
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#1A7A6E" />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: '#5A7A84' }} />
                  )
                }
              />
            )}
          />
        </Form.Item>

        {/* Submit */}
        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            className={shared.submitBtn}
          >
            Create Account
          </Button>
        </Form.Item>

        {/* Login link */}
        <div className={shared.bottomRow}>
          <Text className={shared.bottomText}>
            Already have an account?{' '}
            <Link to="/login" className={shared.bottomLink}>
              Sign in
            </Link>
          </Text>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default RegisterPage