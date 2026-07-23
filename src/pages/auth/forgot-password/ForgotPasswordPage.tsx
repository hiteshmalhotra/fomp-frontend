import { Form, Input, Button, Typography, Divider } from 'antd'
import {
  MailOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '@/pages/auth/_shared/AuthLayout'
import Logo from '@/components/common/Logo'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useForgotPassword } from './hooks/useForgotPassword'
import shared from '@/pages/auth/_shared/auth.module.css'
import styles from './ForgotPasswordPage.module.css'

const { Title, Text } = Typography

const ForgotPasswordPage = () => {
  usePageTitle('Forgot Password')
  const { form, loading, onSubmit } = useForgotPassword()
  const { control, formState: { errors } } = form

  return (
    <AuthLayout
      navRight={
        <Link to="/login" className={shared.navLink}>
          Back to Sign In
        </Link>
      }
    >
      {/* Header */}
      <div className={shared.cardHeader}>
        <div className={shared.cardLogoWrap}>
          <Logo size={48} />
        </div>
        <Title level={2} className={shared.cardTitle}>
          Forgot Password?
        </Title>
        <Text className={shared.cardSubtitle}>
          Enter your registered email and we'll send you a
          6-digit verification code to reset your password.
        </Text>
      </div>

      <Divider className={shared.divider} />

      <Form
        layout="vertical"
        onFinish={onSubmit}
      >
        {/* Email */}
        <Form.Item
          label={<span className={shared.label}>Email Address</span>}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
          style={{ marginBottom: 8 }}
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

        <p className={styles.helperText}>
          We'll send a 6-digit verification code to this email address.
        </p>

        {/* Submit */}
        <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            icon={<SendOutlined />}
            className={shared.submitBtn}
          >
            Send Verification Code
          </Button>
        </Form.Item>

        {/* Back to login */}
        <div className={shared.bottomRow}>
          <Link to="/login" className={shared.backLink}>
            <ArrowLeftOutlined />
            Back to Login
          </Link>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage