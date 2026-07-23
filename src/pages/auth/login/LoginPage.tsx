import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
} from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '@/pages/auth/_shared/AuthLayout'
import Logo from '@/components/common/Logo'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useLogin } from './hooks/useLogin'
import shared from '@/pages/auth/_shared/auth.module.css'
import styles from './LoginPage.module.css'

const { Title, Text } = Typography

const LoginPage = () => {
  usePageTitle('Sign In')
  const { form, loading, countdown, isLimited, onSubmit } = useLogin()
  const { control, formState: { errors } } = form

  return (
    <AuthLayout
      navRight={
        <>
          <Link to="/register" className={shared.navLink}>
            Create Account
          </Link>
          <Link to="/forgot-password" className={shared.navLink}>
            Need Help?
          </Link>
        </>
      }
    >
      {/* Header */}
      <div className={shared.cardHeader}>
        <div className={shared.cardLogoWrap}>
          <Logo size={48} />
        </div>
        <Title level={2} className={shared.cardTitle}>
          Welcome Back
        </Title>
        <Text className={shared.cardSubtitle}>
          Sign in to manage operations, inventory, and reports.
        </Text>
      </div>

      <Divider className={shared.divider} />

      {/* Form */}
      <Form
        layout="vertical"
        onFinish={form.handleSubmit(onSubmit)}
        autoComplete="off"
      >
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
          style={{ marginBottom: 20 }}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined className={shared.inputIcon} />}
                placeholder="Enter your password"
                size="large"
                autoComplete="current-password"
              />
            )}
          />
        </Form.Item>

        {/* Remember me + Forgot password */}
        <Form.Item style={{ marginBottom: 24 }}>
          <div className={styles.rowBetween}>
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  className={styles.checkboxLabel}
                >
                  Remember me
                </Checkbox>
              )}
            />
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        {/* Submit */}
        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            disabled={isLimited}
            className={shared.submitBtn}
          >
            {isLimited ? `Try again in ${countdown}s` : 'Sign In'}
          </Button>
        </Form.Item>

        {/* Register link */}
        <div className={shared.bottomRow}>
          <Text className={shared.bottomText}>
            Don't have an account?{' '}
            <Link to="/register" className={shared.bottomLink}>
              Create one
            </Link>
          </Text>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default LoginPage