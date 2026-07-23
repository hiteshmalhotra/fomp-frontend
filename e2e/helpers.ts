import type { Page } from '@playwright/test'

/** Build an unsigned JWT the frontend can decode (signature never verified client-side). */
export const makeToken = (
  role = 'ROLE_ADMIN',
  expiresInSeconds = 3600
): string => {
  const enc = (o: object) =>
    Buffer.from(JSON.stringify(o))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: 'jane@company.com',
    userId: 42,
    firstName: 'Jane',
    lastName: 'Doe',
    role,
    jti: 'e2e-token',
    iat: now,
    exp: now + expiresInSeconds,
  }
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(payload)}.e2e-signature`
}

const envelope = (data: unknown) => ({
  success: true,
  data,
  message: 'ok',
})

export const MOCK_USERS = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    fullName: 'Jane Doe',
    email: 'jane@company.com',
    role: 'ROLE_ADMIN',
    roleLabel: 'Admin',
    enabled: true,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    lastLoginAt: '2026-07-20T09:00:00Z',
  },
  {
    id: 2,
    firstName: 'Sam',
    lastName: 'Store',
    fullName: 'Sam Store',
    email: 'sam@company.com',
    role: 'ROLE_STORE_MANAGER',
    roleLabel: 'Store Manager',
    enabled: false,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
    lastLoginAt: null,
  },
]

/** Mock every backend endpoint the admin dashboard touches. */
export const mockAdminApis = async (page: Page) => {
  await page.route('**/api/admin/users/count', (route) =>
    route.fulfill({
      json: envelope({ total: 128, active: 120, inactive: 8 }),
    })
  )
  await page.route('**/api/admin/users?**', (route) =>
    route.fulfill({
      json: envelope({
        content: MOCK_USERS,
        totalElements: 2,
        totalPages: 1,
        number: 0,
        size: 10,
      }),
    })
  )
  await page.route('**/actuator/health', (route) =>
    route.fulfill({ json: { status: 'UP', components: {} } })
  )
}

/** Seed an authenticated session (rememberMe=true → localStorage). */
export const seedAuth = async (page: Page, role = 'ROLE_ADMIN') => {
  const token = makeToken(role)
  await page.addInitScript(
    ({ token: t, role: r }) => {
      const state = {
        state: {
          token: t,
          user: {
            id: 42,
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@company.com',
            role: r,
          },
          role: r,
          isAuthenticated: true,
          rememberMe: true,
        },
        version: 0,
      }
      window.localStorage.setItem('fomp-auth', JSON.stringify(state))
    },
    { token, role }
  )
}
