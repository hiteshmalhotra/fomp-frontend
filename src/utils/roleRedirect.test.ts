import { describe, it, expect } from 'vitest'
import { getDashboardRoute, getRoleLabel } from './roleRedirect'
import { isRoutablePath } from '@/router/paths'

describe('getDashboardRoute', () => {
  it.each([
    ['ROLE_ADMIN', '/admin/dashboard'],
    ['ROLE_STORE_MANAGER', '/store/dashboard'],
    ['ROLE_KITCHEN_MANAGER', '/kitchen/dashboard'],
    ['ROLE_CANTEEN_MANAGER', '/canteen/dashboard'],
    ['ROLE_USER', '/profile'],
  ] as const)('%s → %s', (role, route) => {
    expect(getDashboardRoute(role)).toBe(route)
  })

  it('falls back to /login for missing role', () => {
    expect(getDashboardRoute(null)).toBe('/login')
    expect(getDashboardRoute(undefined)).toBe('/login')
  })

  it('every role home route is actually routable', () => {
    const roles = [
      'ROLE_ADMIN',
      'ROLE_STORE_MANAGER',
      'ROLE_KITCHEN_MANAGER',
      'ROLE_CANTEEN_MANAGER',
      'ROLE_USER',
    ] as const
    roles.forEach((role) => {
      expect(isRoutablePath(getDashboardRoute(role))).toBe(true)
    })
  })
})

describe('getRoleLabel', () => {
  it('maps roles to display labels', () => {
    expect(getRoleLabel('ROLE_STORE_MANAGER')).toBe('Store Manager')
  })

  it('handles missing role', () => {
    expect(getRoleLabel(null)).toBe('Unknown')
  })
})
