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
  EyeInvisibleOutlined,
  EyeTwoTone,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { Controller, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '@/pages/auth/_shared/AuthLayout'
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator'
import { useResetPassword } from './hooks/useResetPassword'
import shared from '@/pages/auth/_shared/auth.module.css'
import styles from './ResetPasswordPage.module.css'

const { Title, Text } = Typography

const OTP_EXPIRY_SECONDS = 300 // 5 minutes

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { form, loading, email, hasValidState, onSubmit } = useResetPassword()
  const { control, formState: { errors }, setValue } = form

  const passwordValue = useWatch({ control, name: 'newPassword' })

  // Guard — no email state means user landed directly, redirect back
  useEffect(() => {
    if (!hasValidState) {
      navigate('/forgot-password', { replace: true })
    }
  }, [hasValidState, navigate])

  if (!hasValidState) return null

  // Individual OTP digit handler
  const handleOtpChange = (index: number, char: string) => {
    const digits = (form.getValues('otp') ?? '').split('')
    digits[index] = char.replace(/\D/g, '').slice(-1)
    setValue('otp', digits.join(''), { shouldValidate: true })

    // Auto-focus next input
    if (char && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      const digits = (form.getValues('otp') ?? '').split('')
      if (!digits[index] && index > 0) {
        const prev = document.getElementById(`otp-${index - 1}`)
        prev?.focus()
      }
    }
  }

  const otpValue = useWatch({ control, name: 'otp' }) ?? ''

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
          <span className={shared.cardLogoIcon}>🍽</span>
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
        autoComplete="off"
      >
        {/* OTP */}
        <Form.Item
          label={
            <span className={shared.label}>Verification Code</span>
          }
          validateStatus={errors.otp ? 'error' : ''}
          help={errors.otp?.message}
          style={{ marginBottom: 0 }}
        >
          {/* Hidden field for RHF */}
          <Controller
            name="otp"
            control={control}
            render={() => <input type="hidden" />}
          />

          {/* Visual OTP boxes */}
          <div className={styles.otpRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                className={styles.otpInput}
                maxLength={1}
                size="large"
                value={otpValue[i] ?? ''}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                status={errors.otp ? 'error' : ''}
              />
            ))}
          </div>
        </Form.Item>

        {/* OTP footer */}
        <div className={styles.otpFooter}>
          <span className={styles.expiryText}>
            <ClockCircleOutlined />
            Code expires in {Math.floor(OTP_EXPIRY_SECONDS / 60)}:
            {String(OTP_EXPIRY_SECONDS % 60).padStart(2, '0')}
          </span>
          <Button
            type="link"
            className={styles.resendBtn}
            onClick={() => navigate('/forgot-password')}
          >
            Didn't receive? Resend
          </Button>
        </div>

        {/* New password */}
        <Form.Item
          label={<span className={shared.label}>New Password</span>}
          validateStatus={errors.newPassword ? 'error' : ''}
          help={errors.newPassword?.message}
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
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#1A7A6E" />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{ color: '#5A7A84' }}
                    />
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
          label={
            <span className={shared.label}>Confirm New Password</span>
          }
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
                placeholder="Re-enter your new password"
                size="large"
                autoComplete="new-password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#1A7A6E" />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{ color: '#5A7A84' }}
                    />
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