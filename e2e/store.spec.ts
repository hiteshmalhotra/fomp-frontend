import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { seedAuth } from './helpers'

const envelope = (data: unknown) => ({ success: true, data, message: 'ok' })

const LOCATIONS = [
  {
    id: 1,
    name: 'Central Store',
    locationCode: 'CST-01',
    description: null,
    locationType: 'CENTRAL_STORE',
    active: true,
  },
  {
    id: 2,
    name: 'Main Canteen',
    locationCode: 'CTN-01',
    description: null,
    locationType: 'CANTEEN',
    active: true,
  },
]

const STOCK_ROWS = [
  {
    id: 11,
    itemId: 1,
    itemName: 'Basmati Rice',
    itemCode: 'GRC-001',
    unitName: 'KG',
    locationId: 1,
    locationName: 'Central Store',
    locationCode: 'CST-01',
    quantity: 120,
    reorderLevel: 50,
    maxStockLevel: 500,
    belowReorderLevel: false,
    averagePrice: 85.5,
    lastPurchasePrice: 86,
    stockValue: 10260,
    lastMovementAt: '2026-07-20T09:00:00',
    lastUpdatedAt: '2026-07-20T09:00:00',
  },
  {
    id: 12,
    itemId: 2,
    itemName: 'Toor Dal',
    itemCode: 'GRC-002',
    unitName: 'KG',
    locationId: 1,
    locationName: 'Central Store',
    locationCode: 'CST-01',
    quantity: 10,
    reorderLevel: 40,
    maxStockLevel: 200,
    belowReorderLevel: true,
    averagePrice: 140,
    lastPurchasePrice: 142,
    stockValue: 1400,
    lastMovementAt: '2026-07-21T09:00:00',
    lastUpdatedAt: '2026-07-21T09:00:00',
  },
]

const mockStoreApis = async (page: Page) => {
  await page.route('**/api/store/locations', (route) =>
    route.fulfill({ json: envelope(LOCATIONS) })
  )
  await page.route('**/api/store/dashboard/summary**', (route) =>
    route.fulfill({
      json: envelope({
        totalStockItems: 42,
        lowStockCount: 3,
        pendingPoCount: 5,
        pendingChallanCount: 2,
        totalStockValue: 250000,
      }),
    })
  )
  await page.route('**/api/store/stock/low-stock/**', (route) =>
    route.fulfill({ json: envelope([STOCK_ROWS[1]]) })
  )
  await page.route('**/api/store/po?**', (route) =>
    route.fulfill({
      json: envelope({
        content: [
          {
            id: 1,
            poNumber: 'PO-2026-0001',
            supplierId: 1,
            supplierName: 'Agro Traders',
            status: 'SENT',
            poDate: '2026-07-20',
            expectedDeliveryDate: '2026-07-25',
            totalAmount: 42000,
            createdAt: '2026-07-20T10:00:00',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 5,
      }),
    })
  )
  await page.route('**/api/store/challans?**', (route) =>
    route.fulfill({
      json: envelope({
        content: [
          {
            id: 1,
            challanNumber: 'CH-2026-0007',
            fromLocationName: 'Central Store',
            toLocationName: 'Main Canteen',
            status: 'SUBMITTED',
            challanDate: '2026-07-21',
            expectedDeliveryDate: null,
            totalValue: 5200,
            hasShortage: false,
            createdAt: '2026-07-21T10:00:00',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 5,
      }),
    })
  )
  await page.route('**/api/store/categories', (route) =>
    route.fulfill({
      json: envelope([
        { id: 1, name: 'Groceries', description: null, active: true, itemCount: 12 },
      ]),
    })
  )
  await page.route('**/api/store/stock/search**', (route) =>
    route.fulfill({
      json: envelope({
        content: STOCK_ROWS,
        totalElements: 2,
        totalPages: 1,
        number: 0,
        size: 10,
      }),
    })
  )
}

test.describe('Store dashboard (STORE-001)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockStoreApis(page)
    await page.goto('/store/dashboard')
  })

  test('renders KPI cards from the summary endpoint', async ({ page }) => {
    await expect(page.getByText('Total Stock Items', { exact: true })).toBeVisible()
    await expect(page.getByText('42', { exact: true })).toBeVisible()
    await expect(page.getByText('Low Stock Items', { exact: true })).toBeVisible()
    await expect(page.getByText('Pending POs', { exact: true })).toBeVisible()
    await expect(page.getByText('Pending Challans', { exact: true })).toBeVisible()
  })

  test('shows low stock alerts with status tag', async ({ page }) => {
    await expect(page.getByText('Toor Dal')).toBeVisible()
    await expect(page.getByText('CRITICAL', { exact: true })).toBeVisible()
  })

  test('shows recent PO and challan feeds', async ({ page }) => {
    await expect(page.getByText('PO-2026-0001')).toBeVisible()
    await expect(page.getByText('Agro Traders', { exact: false })).toBeVisible()
    await expect(page.getByText('CH-2026-0007')).toBeVisible()
  })
})

test.describe('Stock View (STORE-012)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockStoreApis(page)
    await page.goto('/store/stock')
  })

  test('renders the stock table with derived status', async ({ page }) => {
    const table = page.locator('.ant-table')
    await expect(table.getByText('Basmati Rice', { exact: true })).toBeVisible()
    await expect(table.getByText('OK', { exact: true })).toBeVisible()
    await expect(table.getByText('CRITICAL', { exact: true })).toBeVisible()
    await expect(page.getByText('2 items', { exact: true })).toBeVisible()
  })

  test('search triggers a server query with the search param', async ({
    page,
  }) => {
    const searchRequest = page.waitForRequest(
      (req) =>
        req.url().includes('/api/store/stock/search') &&
        req.url().includes('search=rice')
    )
    await page
      .getByRole('textbox', { name: 'Search stock by item name or code' })
      .fill('rice')
    await searchRequest
  })

  test('admin role can also open store screens', async ({ page }) => {
    await seedAuth(page, 'ROLE_ADMIN')
    await page.goto('/store/stock')
    await expect(
      page.getByRole('heading', { name: 'Current Stock', level: 1 })
    ).toBeVisible()
  })
})
