import { useEffect, useRef } from 'react'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getTokenRemainingSeconds } from '@/utils/jwt'

const WARN_BEFORE_SECONDS = 120 // warn 2 minutes before expiry
const CHECK_INTERVAL_MS = 30_000

/**
 * Watches the JWT lifetime while the user works inside the dashboard.
 * - 2 minutes before expiry: one modal warning ("save your work, sign in again")
 * - at expiry: clears auth and returns to /login with a message
 * Without this, users are hard-redirected mid-task with no explanation.
 */
export const useSessionExpiryWarning = () => {
  const { modal, message } = App.useApp()
  const navigate = useNavigate()
  const warnedRef = useRef(false)

  useEffect(() => {
    const check = () => {
      const { token, clearAuth } = useAuthStore.getState()
      if (!token) return

      const remaining = getTokenRemainingSeconds(token)

      if (remaining <= 0) {
        clearAuth()
        message.warning('Your session has expired. Please sign in again.')
        navigate('/login', { replace: true })
        return
      }

      if (remaining <= WARN_BEFORE_SECONDS && !warnedRef.current) {
        warnedRef.current = true
        modal.warning({
          title: 'Your session is about to expire',
          content:
            'You will be signed out in less than 2 minutes. Finish or save your work, then sign in again to continue.',
          okText: 'Got it',
        })
      }
    }

    check()
    const timer = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [modal, message, navigate])
}
