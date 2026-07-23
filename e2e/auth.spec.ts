import { test, expect } from '@playwright/test'
import { makeToken, mockAdminApis, seedAuth } from './helpers'

test.describe('Authentication flows', () => {
  test('login form validates before submitting', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Email is required')).toBeVisible()
  })

  test('successful login lands on the admin dashboard', async ({ page }) => {
    await mockAdminApis(page)
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        json: {
          success: true,
          data: {
            token: makeToken('ROLE_ADMIN'),
            tokenType: 'Bearer',
            expiresIn: 3600,
            email: 'jane@company.com',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'ROLE_ADMIN',
          },
          message: 'Login successful',
        },
      })
    )

    await page.goto('/login')
    await page.getByPlaceholder('you@company.com').fill('jane@company.com')
    await page.getByPlaceholder('Enter your password').fill('Passw0rd@')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL('/admin/dashboard')
    await expect(
      page.getByRole('heading', { name: 'Admin Dashboard', level: 1 })
    ).toBeVisible()
  })

  test('invalid credentials show an inline field error', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 401,
        json: {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Bad credentials',
        },
      })
    )

    await page.goto('/login')
    await page.getByPlaceholder('you@company.com').fill('jane@company.com')
    await page.getByPlaceholder('Enter your password').fill('WrongPass1@')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByText('Invalid email or password')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('authenticated users are bounced off /login to their dashboard', async ({
    page,
  }) => {
    await seedAuth(page, 'ROLE_ADMIN')
    await mockAdminApis(page)
    await page.goto('/login')
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('role guard: store manager cannot open the admin dashboard', async ({
    page,
  }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/unauthorized')
    await expect(page.getByText('Access Denied')).toBeVisible()
  })

  test('guests are redirected from protected routes to /login', async ({
    page,
  }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('unknown routes show the 404 page', async ({ page }) => {
    await seedAuth(page, 'ROLE_ADMIN')
    await page.goto('/definitely/not/a/route')
    await expect(page.getByText('Page not found')).toBeVisible()
  })

  test('logout returns to /login and clears the session', async ({ page }) => {
    await seedAuth(page, 'ROLE_ADMIN')
    await mockAdminApis(page)
    await page.route('**/api/auth/logout', (route) =>
      route.fulfill({
        json: { success: true, data: null, message: 'Logged out' },
      })
    )

    await page.goto('/admin/dashboard')
    await page.getByRole('button', { name: /Account menu/ }).click()
    await page.getByText('Logout').click()

    await expect(page).toHaveURL('/login')
    // Session gone: revisiting a protected page bounces back to /login
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
