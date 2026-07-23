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
]

const LEDGER_ROWS = [
  {
    id: 101,
    itemId: 1,
    itemName: 'Basmati Rice',
    itemCode: 'GRC-001',
    unitName: 'KG',
    locationId: 1,
    locationName: 'Central Store',
    locationCode: 'CST-01',
    type: 'PO_RECEIPT',
    movementDirection: 'IN',
    quantity: 100,
    balanceAfter: 220,
    unitPrice: 85,
    totalValue: 8500,
    referenceType: 'PO',
    referenceNumber: 'PO-2026-0001',
    counterpartLocationName: null,
    transactionDate: '2026-07-22',
    remarks: null,
    createdBy: 'store@fomp.com',
    createdAt: '2026-07-22T10:00:00',
  },
  {
    id: 102,
    itemId: 1,
    itemName: 'Basmati Rice',
    itemCode: 'GRC-001',
    unitName: 'KG',
    locationId: 1,
    locationName: 'Central Store',
    locationCode: 'CST-01',
    type: 'TRANSFER_OUT',
    movementDirection: 'OUT',
    quantity: 30,
    balanceAfter: 190,
    unitPrice: 85,
    totalValue: 2550,
    referenceType: 'CHALLAN',
    referenceNumber: 'CH-2026-0007',
    counterpartLocationName: 'Main Canteen',
    transactionDate: '2026-07-22',
    remarks: null,
    createdBy: 'store@fomp.com',
    createdAt: '2026-07-22T12:00:00',
  },
]

const DAYBOOK = {
  date: '2026-07-22',
  locationId: 1,
  locationName: 'Central Store',
  lines: [
    {
      itemId: 1,
      itemName: 'Basmati Rice',
      itemCode: 'GRC-001',
      unitName: 'KG',
      openingQty: 150,
      poReceiptQty: 100,
      transferInQty: 0,
      returnQty: 0,
      transferOutQty: 30,
      productionConsumptionQty: 0,
      productionReceiptQty: 0,
      adjustmentInQty: 0,
      adjustmentOutQty: 0,
      closingQty: 220,
    },
  ],
}

const mockCommon = async (page: Page) => {
  await page.route('**/api/store/locations', (route) =>
    route.fulfill({ json: envelope(LOCATIONS) })
  )
  await page.route('**/api/store/items', (route) =>
    route.fulfill({
      json: envelope([{ id: 1, name: 'Basmati Rice', itemCode: 'GRC-001' }]),
    })
  )
}

test.describe('Stock Ledger (STORE-013)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockCommon(page)
    await page.route('**/api/store/ledger?**', (route) =>
      route.fulfill({
        json: envelope({
          content: LEDGER_ROWS,
          totalElements: 2,
          totalPages: 1,
          number: 0,
          size: 20,
        }),
      })
    )
    await page.goto('/store/ledger')
  })

  test('renders ledger rows with movement tags and running balance', async ({
    page,
  }) => {
    const table = page.locator('.ant-table')
    await expect(table.getByText('PO-2026-0001')).toBeVisible()
    await expect(table.getByText('CH-2026-0007')).toBeVisible()
    await expect(table.getByText('IN', { exact: true })).toBeVisible()
    await expect(table.getByText('OUT', { exact: true })).toBeVisible()
    await expect(table.getByText('220', { exact: true })).toBeVisible()
    await expect(page.getByText('2 entries', { exact: true })).toBeVisible()
  })

  test('movement type filter sends type param to the server', async ({
    page,
  }) => {
    const req = page.waitForRequest(
      (r) => r.url().includes('/api/store/ledger?') && r.url().includes('type=OUT')
    )
    const select = page
      .locator('.ant-select')
      .filter({ has: page.getByLabel('Filter by movement type') })
    await select.locator('.ant-select-selector').click()
    await page.locator('.ant-select-item-option').getByText('OUT only').click()
    await req
  })

  test('item filter sends itemId param to the server', async ({ page }) => {
    const req = page.waitForRequest(
      (r) => r.url().includes('/api/store/ledger?') && r.url().includes('itemId=1')
    )
    const select = page
      .locator('.ant-select')
      .filter({ has: page.getByLabel('Filter by item') })
    await select.locator('.ant-select-selector').click()
    await page
      .locator('.ant-select-item-option')
      .getByText('Basmati Rice (GRC-001)')
      .click()
    await req
  })
})

test.describe('Day Book (STORE-014)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockCommon(page)
    await page.route('**/api/store/ledger/daybook**', (route) =>
      route.fulfill({ json: envelope(DAYBOOK) })
    )
    await page.goto('/store/daybook')
  })

  test('renders the day book register with opening and closing', async ({
    page,
  }) => {
    const table = page.locator('.ant-table')
    await expect(table.getByText('Basmati Rice')).toBeVisible()
    await expect(table.getByText('150', { exact: true })).toBeVisible() // opening
    await expect(table.getByText('220', { exact: true })).toBeVisible() // closing
  })

  test('has a link to consolidated stock (STORE-012)', async ({ page }) => {
    const link = page.getByRole('link', { name: /View Consolidated Stock/ })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/store/stock')
  })
})
