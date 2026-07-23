import { describe, it, expect } from 'vitest'
import { buildMenuForRole, findSelectedKeys, findOpenKeys } from './menuUtils'
import type { MenuItemConfig } from './menuConfig'
import { MENU_CONFIG } from './menuConfig'

const FIXTURE: MenuItemConfig[] = [
  { key: '/admin/dashboard', label: 'Dashboard', roles: ['ROLE_ADMIN'] },
  {
    key: '/store',
    label: 'Store',
    roles: ['ROLE_ADMIN', 'ROLE_STORE_MANAGER'],
    children: [
      {
        key: '/store/challan',
        label: 'Challan',
        roles: ['ROLE_ADMIN', 'ROLE_STORE_MANAGER'],
        children: [
          {
            key: '/store/challan/received',
            label: 'Received',
            roles: ['ROLE_ADMIN', 'ROLE_STORE_MANAGER'],
          },
        ],
      },
    ],
  },
  {
    key: '/kitchen',
    label: 'Kitchen',
    roles: ['ROLE_KITCHEN_MANAGER'],
    children: [],
  },
]

describe('buildMenuForRole', () => {
  it('returns an empty menu when role is null', () => {
    expect(buildMenuForRole(FIXTURE, null)).toEqual([])
  })

  it('filters items the role cannot see', () => {
    const menu = buildMenuForRole(FIXTURE, 'ROLE_STORE_MANAGER')
    const keys = menu.map((m) => (m as { key: string }).key)
    expect(keys).toEqual(['/store'])
  })

  it('drops parents whose children all fail the role filter', () => {
    const menu = buildMenuForRole(FIXTURE, 'ROLE_KITCHEN_MANAGER')
    // /kitchen declares children:[] — nothing passes, parent is dropped
    expect(menu).toEqual([])
  })

  it('keeps nested structure for permitted roles', () => {
    const menu = buildMenuForRole(FIXTURE, 'ROLE_ADMIN')
    const store = menu.find((m) => (m as { key: string }).key === '/store') as {
      children?: unknown[]
    }
    expect(store.children).toHaveLength(1)
  })
})

describe('findSelectedKeys', () => {
  it('returns the deepest matching key', () => {
    expect(findSelectedKeys(FIXTURE, '/store/challan/received')).toEqual([
      '/store/challan/received',
    ])
  })

  it('matches parents for intermediate paths', () => {
    expect(findSelectedKeys(FIXTURE, '/store/challan')).toEqual([
      '/store/challan',
    ])
  })

  it('returns empty for unknown paths', () => {
    expect(findSelectedKeys(FIXTURE, '/nowhere')).toEqual([])
  })
})

describe('findOpenKeys', () => {
  it('opens every ancestor of the current path', () => {
    expect(findOpenKeys(FIXTURE, '/store/challan/received')).toEqual([
      '/store',
      '/store/challan',
    ])
  })

  it('returns empty for top-level paths', () => {
    expect(findOpenKeys(FIXTURE, '/admin/dashboard')).toEqual([])
  })
})

describe('real MENU_CONFIG sanity', () => {
  it('every role sees at least a dashboard', () => {
    const roles = [
      'ROLE_ADMIN',
      'ROLE_STORE_MANAGER',
      'ROLE_KITCHEN_MANAGER',
      'ROLE_CANTEEN_MANAGER',
    ] as const
    roles.forEach((role) => {
      const menu = buildMenuForRole(MENU_CONFIG, role)
      expect(menu.length).toBeGreaterThan(0)
    })
  })
})
