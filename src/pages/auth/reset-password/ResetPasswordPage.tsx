import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
} from 'antd'
import {
  LockOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { Controller, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '@/pages/auth/_shared/AuthLayout'
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator'
import Logo from '@/components/common/Logo'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fieldError } from '@/utils/formA11y'
import { useResetPassword } from './hooks/useResetPassword'
import shared from '@/pages/auth/_shared/auth.module.css'
import styles from './ResetPasswordPage.module.css'

const { Title, Text } = Typography

const formatCountdown = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

const ResetPasswordPage = () => {
  usePageTitle('Reset Password')
  const navigate = useNavigate()
  const {
    form,
    loading,
    email,
    hasValidState,
    expiresIn,
    resend,
    resending,
    onSubmit,
  } = useResetPassword()
  const { control, formState: { errors } } = form

  const passwordValue = useWatch({ control, name: 'newPassword' })

  // Guard — no email state means user landed directly, redirect back
  useEffect(() => {
    if (!hasValidState) {
      navigate('/forgot-password', { replace: true })
    }
  }, [hasValidState, navigate])

  if (!hasValidState) return null

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
          Reset Your Password
        </Title>
        <Text className={shared.cardSubtitle}>
          Enter the 6-digit code sent to your email and set a new password.
        </Text>
      </div>

      <Divider className={shared.divider} />

      {/* Email banner */}
      <div className={styles.emailBanner}>
        <div className={styles.emailBannerLeft}>
          <MailOutlined className={styles.emailBannerIcon} />
          <div>
            <div className={styles.emailBannerLabel}>
              Code sent to
            </div>
            <div className={styles.emailBannerValue}>{email}</div>
          </div>
        </div>
        <Link to="/forgot-password" className={styles.changeLink}>
          Change
        </Link>
      </div>

      <Form
        layout="vertical"
        onFinish={onSubmit}
      >
        {/* OTP — antd Input.OTP: paste, keyboard nav and focus handled natively */}
        <Form.Item
          label={
            <span className={shared.label}>Verification Code</span>
          }
          validateStatus={errors.otp ? 'error' : ''}
          help={fieldError(errors.otp?.message)}
          style={{ marginBottom: 0 }}
        >
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <Input.OTP
                length={6}
                size="large"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                onInput={(chars) => field.onChange(chars.join(''))}
                status={errors.otp ? 'error' : ''}
                aria-label="6-digit verification code"
              />
            )}
          />
        </Form.Item>

        {/* OTP footer — live countdown + in-place resend */}
        <div className={styles.otpFooter}>
          <span
            className={styles.expiryText}
            role="timer"
            aria-live="off"
          >
            <ClockCircleOutlined aria-hidden="true" />
            {expiresIn > 0
              ? `Code expires in ${formatCountdown(expiresIn)}`
              : 'Code expired — request a new one'}
          </span>
          <Button
            type="link"
            className={styles.resendBtn}
            onClick={resend}
            loading={resending}
          >
            Didn't receive? Resend
          </Button>
        </div>

        {/* New password */}
        <Form.Item
          label={<span className={shared.label}>New Password</span>}
          validateStatus={errors.newPassword ? 'error' : ''}
          help={fieldError(errors.newPassword?.message)}
          style={{ marginBottom: 8 }}
        >
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined className={shared.inputIcon} />}
                placeholder="Create a strong password"
                size="large"
                autoComplete="new-password"
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
          label={
            <span className={shared.label}>Confirm New Password</span>
          }
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={fieldError(errors.confirmPassword?.message)}
          style={{ marginBottom: 24 }}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined className={shared.inputIcon} />}
                placeholder="Re-enter your new password"
                size="large"
                autoComplete="new-password"
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
            Reset Password
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

export default ResetPasswordPage