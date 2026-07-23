import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import GuestRoute from './GuestRoute'
import RoleRoute from './RoleRoute'
import RouteError from './RouteError'
import { ROUTE_PATHS } from './paths'
import {
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  UnauthorizedPage,
  NotFoundPage,
  AdminDashboardPage,
  StoreDashboardPage,
  StockViewPage,
  DashboardPlaceholder,
  PageFallback,
  RootRedirect,
} from './lazyPages'

// Layout — eager: shell for every protected page
import DashboardLayout from '@/layouts/DashboardLayout'

// Login — eager: it is the entry screen, no point lazy-loading it
import LoginPage from '@/pages/auth/login'

const lazyPage = (element: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
)

const router = createBrowserRouter([
  // ─── Public (guest-only) ─────────────────────────────────
  {
    errorElement: <RouteError />,
    children: [
      {
        path: ROUTE_PATHS.login,
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: ROUTE_PATHS.register,
        element: <GuestRoute>{lazyPage(<RegisterPage />)}</GuestRoute>,
      },
      {
        path: ROUTE_PATHS.forgotPassword,
        element: <GuestRoute>{lazyPage(<ForgotPasswordPage />)}</GuestRoute>,
      },
      {
        path: ROUTE_PATHS.resetPassword,
        element: <GuestRoute>{lazyPage(<ResetPasswordPage />)}</GuestRoute>,
      },
      { path: ROUTE_PATHS.unauthorized, element: lazyPage(<UnauthorizedPage />) },
    ],
  },

  // ─── Protected — all inside DashboardLayout ──────────────
  {
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <RouteError />,
    children: [
      // Admin routes
      {
        path: ROUTE_PATHS.adminDashboard,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            {lazyPage(<AdminDashboardPage />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.adminUsers,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            {lazyPage(<DashboardPlaceholder role="User Management" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.adminRoles,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            {lazyPage(<DashboardPlaceholder role="Roles & Permissions" />)}
          </RoleRoute>
        ),
      },

      // Store routes
      {
        path: ROUTE_PATHS.storeDashboard,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<StoreDashboardPage />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.storeStock,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<StockViewPage />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.storeDaybook,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Day Book" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.storeLedger,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Store Ledger" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.storePo,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="PO Creation" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.storeChallanPacked,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Packed Challans" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.storeChallanUnpacked,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Unpacked Challans" />)}
          </RoleRoute>
        ),
      },

      // Kitchen routes
      {
        path: ROUTE_PATHS.kitchenDashboard,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_KITCHEN_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Kitchen" />)}
          </RoleRoute>
        ),
      },

      // Canteen routes
      {
        path: ROUTE_PATHS.canteenDashboard,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Canteen" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.canteenChallanRequest,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Request Material" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.canteenChallanTransfer,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Transfer Material" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.canteenLedger,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            {lazyPage(<DashboardPlaceholder role="Canteen Ledger" />)}
          </RoleRoute>
        ),
      },

      // Shared routes
      {
        path: ROUTE_PATHS.inventory,
        element: lazyPage(<DashboardPlaceholder role="Inventory" />),
      },
      {
        path: ROUTE_PATHS.reports,
        element: lazyPage(<DashboardPlaceholder role="Reports" />),
      },
      {
        path: ROUTE_PATHS.audit,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            {lazyPage(<DashboardPlaceholder role="Audit Logs" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.settings,
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            {lazyPage(<DashboardPlaceholder role="Settings" />)}
          </RoleRoute>
        ),
      },
      {
        path: ROUTE_PATHS.profile,
        element: lazyPage(<DashboardPlaceholder role="Profile" />),
      },
      {
        path: ROUTE_PATHS.notifications,
        element: lazyPage(<DashboardPlaceholder role="Notifications" />),
      },
    ],
  },

  // ─── Root + fallback ─────────────────────────────────────
  { path: '/', element: <RootRedirect /> },
  { path: '*', element: lazyPage(<NotFoundPage />), errorElement: <RouteError /> },
])

export default router
