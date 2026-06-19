import { createBrowserRouter, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'

// Layout
import DashboardLayout from '@/layouts/DashboardLayout'

// Auth pages
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ForgotPasswordPage from '@/pages/auth/forgot-password'
import ResetPasswordPage from '@/pages/auth/reset-password'
import UnauthorizedPage from '@/pages/auth/unauthorized'

// Placeholder — replaced screen by screen as we build
import DashboardPlaceholder from '@/pages/DashboardPlaceholder'
import AdminDashboardPage from '@/pages/admin/dashboard'

const router = createBrowserRouter([
  // ─── Public ──────────────────────────────────────────────
  { path: '/login',            element: <LoginPage /> },
  { path: '/register',         element: <RegisterPage /> },
  { path: '/forgot-password',  element: <ForgotPasswordPage /> },
  { path: '/reset-password',   element: <ResetPasswordPage /> },
  { path: '/unauthorized',     element: <UnauthorizedPage /> },

  // ─── Protected — all inside DashboardLayout ──────────────
  {
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Admin routes
      {
        path: '/admin/dashboard',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboardPage />
          </RoleRoute>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardPlaceholder role="User Management" />
          </RoleRoute>
        ),
      },
      {
        path: '/admin/roles',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardPlaceholder role="Roles & Permissions" />
          </RoleRoute>
        ),
      },

      // Store routes
      {
        path: '/store/dashboard',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            <DashboardPlaceholder role="Store" />
          </RoleRoute>
        ),
      },
      {
        path: '/store/daybook',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            <DashboardPlaceholder role="Day Book" />
          </RoleRoute>
        ),
      },
      {
        path: '/store/ledger',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            <DashboardPlaceholder role="Store Ledger" />
          </RoleRoute>
        ),
      },
      {
        path: '/store/po',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            <DashboardPlaceholder role="PO Creation" />
          </RoleRoute>
        ),
      },
      {
        path: '/store/challan/received/packed',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            <DashboardPlaceholder role="Packed Challans" />
          </RoleRoute>
        ),
      },
      {
        path: '/store/challan/received/unpacked',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STORE_MANAGER']}>
            <DashboardPlaceholder role="Unpacked Challans" />
          </RoleRoute>
        ),
      },

      // Kitchen routes
      {
        path: '/kitchen/dashboard',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_KITCHEN_MANAGER']}>
            <DashboardPlaceholder role="Kitchen" />
          </RoleRoute>
        ),
      },

      // Canteen routes
      {
        path: '/canteen/dashboard',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            <DashboardPlaceholder role="Canteen" />
          </RoleRoute>
        ),
      },
      {
        path: '/canteen/challan/request',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            <DashboardPlaceholder role="Request Material" />
          </RoleRoute>
        ),
      },
      {
        path: '/canteen/challan/transfer',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            <DashboardPlaceholder role="Transfer Material" />
          </RoleRoute>
        ),
      },
      {
        path: '/canteen/ledger',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CANTEEN_MANAGER']}>
            <DashboardPlaceholder role="Canteen Ledger" />
          </RoleRoute>
        ),
      },

      // Shared routes
      {
        path: '/inventory',
        element: <DashboardPlaceholder role="Inventory" />,
      },
      {
        path: '/reports',
        element: <DashboardPlaceholder role="Reports" />,
      },
      {
        path: '/audit',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardPlaceholder role="Audit Logs" />
          </RoleRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardPlaceholder role="Settings" />
          </RoleRoute>
        ),
      },
      {
        path: '/profile',
        element: <DashboardPlaceholder role="Profile" />,
      },
      {
        path: '/notifications',
        element: <DashboardPlaceholder role="Notifications" />,
      },
    ],
  },

  // ─── Fallback ────────────────────────────────────────────
  { path: '/',  element: <Navigate to="/login" replace /> },
  { path: '*',  element: <Navigate to="/login" replace /> },
])

export default router