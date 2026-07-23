import type { UserRole } from '@/types/auth.types'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MenuItemConfig {
  key: string                    // route path — also used as unique ID
  label: string
  icon?: string                  // key into menuIcons registry
  roles: UserRole[]              // which roles see this item
  children?: MenuItemConfig[]    // nested submenu
}

// ── Role shorthands — keeps the config readable ──────────────────────────────
const ADMIN:    UserRole = 'ROLE_ADMIN'
const STORE:    UserRole = 'ROLE_STORE_MANAGER'
const KITCHEN:  UserRole = 'ROLE_KITCHEN_MANAGER'
const CANTEEN:  UserRole = 'ROLE_CANTEEN_MANAGER'

const ALL_MANAGERS: UserRole[] = [ADMIN, STORE, KITCHEN, CANTEEN]

// ── Master menu tree ─────────────────────────────────────────────────────────
// One array defines everything. Filtering happens at runtime via menuUtils.ts.
// To add a new role or screen: add one entry here. Nothing else changes.

export const MENU_CONFIG: MenuItemConfig[] = [

  // ── Dashboard ──────────────────────────────────────────────────────────────
  {
    key: '/admin/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: [ADMIN],
  },
  {
    key: '/store/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: [STORE],
  },
  {
    key: '/kitchen/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: [KITCHEN],
  },
  {
    key: '/canteen/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: [CANTEEN],
  },

  // ── Admin-only ─────────────────────────────────────────────────────────────
  {
    key: '/admin/users',
    label: 'User Management',
    icon: 'users',
    roles: [ADMIN],
  },
  {
    key: '/admin/roles',
    label: 'Roles & Permissions',
    icon: 'roles',
    roles: [ADMIN],
  },

  // ── Store ──────────────────────────────────────────────────────────────────
  {
    key: '/store',
    label: 'Store',
    icon: 'stores',
    roles: [ADMIN, STORE],
    children: [
      {
        key: '/store/dashboard',
        label: 'Store Dashboard',
        icon: 'dashboard',
        roles: [ADMIN, STORE],
      },
      {
        key: '/store/stock',
        label: 'Stock View',
        icon: 'inventory',
        roles: [ADMIN, STORE],
      },
      {
        key: '/store/daybook',
        label: 'Day Book',
        icon: 'daybook',
        roles: [ADMIN, STORE],
      },
      {
        key: '/store/ledger',
        label: 'Ledger',
        icon: 'ledger',
        roles: [ADMIN, STORE],
      },
      {
        key: '/store/po',
        label: 'Purchase Orders',
        icon: 'po',
        roles: [ADMIN, STORE],
      },
      {
        key: '/store/challan',
        label: 'Challan',
        icon: 'challan',
        roles: [ADMIN, STORE],
        children: [
          {
            key: '/store/challan/received',
            label: 'Received',
            icon: 'received',
            roles: [ADMIN, STORE],
            children: [
              {
                key: '/store/challan/received/packed',
                label: 'Packed',
                icon: 'packed',
                roles: [ADMIN, STORE],
              },
              {
                key: '/store/challan/received/unpacked',
                label: 'Unpacked',
                icon: 'unpacked',
                roles: [ADMIN, STORE],
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Kitchen ────────────────────────────────────────────────────────────────
  {
    key: '/kitchen',
    label: 'Kitchen',
    icon: 'kitchens',
    roles: [ADMIN, KITCHEN],
    children: [
      // Add screens here as they're built
    ],
  },

  // ── Canteen ────────────────────────────────────────────────────────────────
  {
    key: '/canteen',
    label: 'Canteen',
    icon: 'canteens',
    roles: [ADMIN, CANTEEN],
    children: [
      {
      key: '/canteen/dashboard',
      label: 'Canteen Dashboard',
      icon: 'dashboard',
      roles: [ADMIN, CANTEEN],
      },
      {
        key: '/canteen/challan',
        label: 'Challan',
        icon: 'challan',
        roles: [ADMIN, CANTEEN],
        children: [
          {
            key: '/canteen/challan/request',
            label: 'Request Material',
            icon: 'request',
            roles: [ADMIN, CANTEEN],
          },
          {
            key: '/canteen/challan/transfer',
            label: 'Transfer Material',
            icon: 'transfer',
            roles: [ADMIN, CANTEEN],
          },
        ],
      },
      {
        key: '/canteen/ledger',
        label: 'Ledger',
        icon: 'ledger',
        roles: [ADMIN, CANTEEN],
      },
    ],
  },

  // ── Shared — all managers ──────────────────────────────────────────────────
  {
    key: '/inventory',
    label: 'Inventory',
    icon: 'inventory',
    roles: ALL_MANAGERS,
  },
  {
    key: '/reports',
    label: 'Reports',
    icon: 'reports',
    roles: ALL_MANAGERS,
  },
  {
    key: '/audit',
    label: 'Audit Logs',
    icon: 'audit',
    roles: [ADMIN],
  },
  {
    key: '/settings',
    label: 'Settings',
    icon: 'settings',
    roles: [ADMIN],
  },
]