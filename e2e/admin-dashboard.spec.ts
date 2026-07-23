import { test, expect } from '@playwright/test'
import { mockAdminApis, seedAuth, MOCK_USERS } from './helpers'

test.describe('Admin dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_ADMIN')
    await mockAdminApis(page)
    await page.goto('/admin/dashboard')
  })

  test('renders real KPI cards from the counts endpoint', async ({ page }) => {
    await expect(page.getByText('Total Users', { exact: true })).toBeVisible()
    await expect(page.getByText('128', { exact: true })).toBeVisible()
    await expect(page.getByText('Active Users', { exact: true })).toBeVisible()
    await expect(page.getByText('120', { exact: true })).toBeVisible()
    await expect(page.getByText('Inactive Users', { exact: true })).toBeVisible()
  })

  test('renders the users table with server data and total', async ({
    page,
  }) => {
    const table = page.locator('.ant-table')
    await expect(table.getByText('Jane Doe', { exact: true })).toBeVisible()
    await expect(
      table.getByText('sam@company.com', { exact: true })
    ).toBeVisible()
    await expect(page.getByText('2 users', { exact: true })).toBeVisible()
  })

  test('search input triggers a server query with the search param', async ({
    page,
  }) => {
    const searchRequest = page.waitForRequest(
      (req) =>
        req.url().includes('/api/admin/users?') &&
        req.url().includes('search=jane')
    )
    await page
      .getByRole('textbox', { name: 'Search users by name or email' })
      .fill('jane')
    await searchRequest // debounced 300ms — resolves when the request fires
  })

  test('delete asks for confirmation naming the user', async ({ page }) => {
    await page
      .getByRole('button', { name: `Delete ${MOCK_USERS[0].fullName}` })
      .click()
    const dialog = page.getByRole('dialog')
    await expect(
      dialog.locator('.ant-modal-confirm-title')
    ).toHaveText('Delete this user?')
    await expect(
      dialog.getByText(
        /Jane Doe \(jane@company.com\) will be permanently removed/
      )
    ).toBeVisible()
    // Cancel keeps the row
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(
      page.locator('.ant-table').getByText('Jane Doe', { exact: true })
    ).toBeVisible()
  })

  test('create-user drawer enforces the shared password policy', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Add User' }).click()
    await expect(page.getByText('Add New User')).toBeVisible()

    await page.getByPlaceholder('First name').fill('New')
    await page.getByPlaceholder('Last name').fill('Person')
    await page.getByPlaceholder('you@company.com').fill('new@company.com')
    await page.getByPlaceholder('Create a strong password').fill('weakpass')
    await page.getByRole('button', { name: 'Create User' }).click()

    await expect(
      page.getByText('Password must contain at least one uppercase letter')
    ).toBeVisible()
  })

  test('system health panel shows the gateway status', async ({ page }) => {
    await expect(page.getByText('System Health')).toBeVisible()
    await expect(page.getByText('API Gateway')).toBeVisible()
    await expect(page.getByText('Healthy')).toBeVisible()
  })

  test('skip link appears on keyboard focus and jumps to content', async ({
    page,
  }) => {
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Skip to main content' })
    await expect(skipLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content$/)
  })
})
