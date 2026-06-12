import { createBrowserRouter, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'

// Auth pages
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ForgotPasswordPage from '@/pages/auth/forgot-password'
import ResetPasswordPage from '@/pages/auth/reset-password'
import UnauthorizedPage from '@/pages/auth/unauthorized'

// Placeholder — replaced screen by screen as we build
import DashboardPlaceholder from '@/pages/DashboardPlaceholder'

const router = createBrowserRouter([
  // ─── Public ──────────────────────────────────────────────
  { path: '/login',            element: <LoginPage /> },
  { path: '/register',         element: <RegisterPage /> },
  { path: '/forgot-password',  element: <ForgotPasswordPage /> },
  { path: '/reset-password',   element: <ResetPasswordPage /> },
  { path: '/unauthorized',     element: <UnauthorizedPage /> },

  // ─── Admin ───────────────────────────────────────────────
  {
    path: '/admin/*',
    element: (
      <PrivateRoute>
        <RoleRoute allowedRoles={['ROLE_ADMIN']}>
          <DashboardPlaceholder role="Admin" />
        </RoleRoute>
      </PrivateRoute>
    ),
  },

  // ─── Store Manager ───────────────────────────────────────
  {
    path: '/store/*',
    element: (
      <PrivateRoute>
        <RoleRoute allowedRoles={['ROLE_STORE_MANAGER']}>
          <DashboardPlaceholder role="Store Manager" />
        </RoleRoute>
      </PrivateRoute>
    ),
  },

  // ─── Kitchen Manager ─────────────────────────────────────
  {
    path: '/kitchen/*',
    element: (
      <PrivateRoute>
        <RoleRoute allowedRoles={['ROLE_KITCHEN_MANAGER']}>
          <DashboardPlaceholder role="Kitchen Manager" />
        </RoleRoute>
      </PrivateRoute>
    ),
  },

  // ─── Canteen Manager ─────────────────────────────────────
  {
    path: '/canteen/*',
    element: (
      <PrivateRoute>
        <RoleRoute allowedRoles={['ROLE_CANTEEN_MANAGER']}>
          <DashboardPlaceholder role="Canteen Manager" />
        </RoleRoute>
      </PrivateRoute>
    ),
  },

  // ─── Shared protected ────────────────────────────────────
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <DashboardPlaceholder role="Profile" />
      </PrivateRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <PrivateRoute>
        <DashboardPlaceholder role="Notifications" />
      </PrivateRoute>
    ),
  },

  // ─── Fallback ─────────────────────────────────────────────
  { path: '/',  element: <Navigate to="/login" replace /> },
  { path: '*',  element: <Navigate to="/login" replace /> },
])

export default router