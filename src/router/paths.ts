/**
 * Canonical list of every routable path in the app.
 * Single source of truth shared by the router and the breadcrumb —
 * the breadcrumb only links segments that resolve to a real route.
 */
export const ROUTE_PATHS = {
  // Public
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  unauthorized: '/unauthorized',

  // Admin
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminRoles: '/admin/roles',

  // Store
  storeDashboard: '/store/dashboard',
  storeStock: '/store/stock',
  storeDaybook: '/store/daybook',
  storeLedger: '/store/ledger',
  storePo: '/store/po',
  storePoCreate: '/store/po/create',
  // detail is dynamic: /store/po/:id — see storePoDetail()
  storeChallan: '/store/challan',
  storeChallanCreate: '/store/challan/create',
  // detail is dynamic: /store/challan/:id — see storeChallanDetail()

  // Kitchen
  kitchenDashboard: '/kitchen/dashboard',

  // Canteen
  canteenDashboard: '/canteen/dashboard',
  canteenChallanRequest: '/canteen/challan/request',
  canteenChallanTransfer: '/canteen/challan/transfer',
  canteenLedger: '/canteen/ledger',

  // Shared
  inventory: '/inventory',
  reports: '/reports',
  audit: '/audit',
  settings: '/settings',
  profile: '/profile',
  notifications: '/notifications',
} as const

const ALL_PATHS = new Set<string>(Object.values(ROUTE_PATHS))

/** True if the exact path has a route definition. */
export const isRoutablePath = (path: string): boolean => ALL_PATHS.has(path)

/** Dynamic PO detail route (STORE-008). */
export const storePoDetail = (id: number | string): string =>
  `/store/po/${id}`

/** Dynamic challan detail route (STORE-011). */
export const storeChallanDetail = (id: number | string): string =>
  `/store/challan/${id}`
