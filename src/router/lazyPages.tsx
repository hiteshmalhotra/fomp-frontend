import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardRoute } from '@/utils/roleRedirect'
import { ROUTE_PATHS } from './paths'

/**
 * Route-level code splitting — every export here is a component,
 * keeping this file compatible with React Fast Refresh.
 * Login stays eager (entry screen) and lives in index.tsx.
 */
export const RegisterPage       = lazy(() => import('@/pages/auth/register'))
export const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password'))
export const ResetPasswordPage  = lazy(() => import('@/pages/auth/reset-password'))
export const UnauthorizedPage   = lazy(() => import('@/pages/auth/unauthorized'))
export const NotFoundPage       = lazy(() => import('@/pages/NotFound'))
export const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'))
export const StoreDashboardPage = lazy(() => import('@/pages/store/dashboard'))
export const StockViewPage      = lazy(() => import('@/pages/store/stock'))
export const StockLedgerPage    = lazy(() => import('@/pages/store/ledger'))
export const DayBookPage        = lazy(() => import('@/pages/store/daybook'))
export const PurchaseOrderListPage   = lazy(() => import('@/pages/store/po'))
export const CreatePurchaseOrderPage = lazy(
  () => import('@/pages/store/po/CreatePurchaseOrderPage')
)
export const PurchaseOrderDetailPage = lazy(
  () => import('@/pages/store/po/PurchaseOrderDetailPage')
)
export const DashboardPlaceholder = lazy(() => import('@/pages/DashboardPlaceholder'))

export const PageFallback = () => (
  <div
    style={{
      minHeight: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spin size="large" aria-label="Loading page" />
  </div>
)

/** `/` lands on the role dashboard when authenticated, /login otherwise. */
export const RootRedirect = () => {
  const { isAuthenticated, role } = useAuthStore()
  return (
    <Navigate
      to={isAuthenticated ? getDashboardRoute(role) : ROUTE_PATHS.login}
      replace
    />
  )
}
