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

const ITEMS = [{ id: 1, name: 'Basmati Rice', itemCode: 'GRC-001' }]

const CHALLAN_LIST = {
  content: [
    {
      id: 7,
      challanNumber: 'CH-2026-0007',
      fromLocationId: 1,
      fromLocationName: 'Central Store',
      toLocationId: 2,
      toLocationName: 'Main Canteen',
      status: 'DRAFT',
      challanDate: '2026-07-22',
      expectedDeliveryDate: null,
      totalValue: 5200,
      hasShortage: false,
      createdAt: '2026-07-22T10:00:00',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
}

const line = {
  id: 70,
  itemId: 1,
  itemName: 'Basmati Rice',
  itemCode: 'GRC-001',
  unitName: 'KG',
  requestedQuantity: 50,
  approvedQuantity: null,
  packedQuantity: null,
  dispatchedQuantity: null,
  receivedQuantity: null,
  shortageQuantity: null,
  shortageReason: null,
  averagePrice: 85,
  lineValue: 4250,
  hasShortage: false,
  fullyReceived: false,
  packingRemarks: null,
  receiptRemarks: null,
}

const CHALLAN_DETAIL = {
  id: 7,
  challanNumber: 'CH-2026-0007',
  fromLocationId: 1,
  fromLocationName: 'Central Store',
  fromLocationCode: 'CST-01',
  toLocationId: 2,
  toLocationName: 'Main Canteen',
  toLocationCode: 'CTN-01',
  status: 'SUBMITTED',
  challanDate: '2026-07-22',
  expectedDeliveryDate: null,
  dispatchedDate: null,
  receivedDate: null,
  verifiedDate: null,
  totalValue: 4250,
  hasShortage: false,
  shortageRemarks: null,
  vehicleNumber: null,
  driverName: null,
  createdBy: 'store@fomp.com',
  approvedBy: null,
  dispatchedBy: null,
  receivedBy: null,
  verifiedBy: null,
  createdAt: '2026-07-22T10:00:00',
  lineItems: [line],
}

const mockRef = async (page: Page) => {
  await page.route('**/api/store/locations', (r) =>
    r.fulfill({ json: envelope(LOCATIONS) })
  )
  await page.route('**/api/store/items', (r) =>
    r.fulfill({ json: envelope(ITEMS) })
  )
  await page.route('**/api/store/stock/location/**', (r) =>
    r.fulfill({
      json: envelope([
        {
          id: 1,
          itemId: 1,
          itemName: 'Basmati Rice',
          itemCode: 'GRC-001',
          unitName: 'KG',
          locationId: 1,
          locationName: 'Central Store',
          locationCode: 'CST-01',
          quantity: 200,
          reorderLevel: 50,
          maxStockLevel: 500,
          belowReorderLevel: false,
          averagePrice: 85,
          lastPurchasePrice: 85,
          stockValue: 17000,
          lastMovementAt: null,
          lastUpdatedAt: null,
        },
      ]),
    })
  )
}

test.describe('Challan List (STORE-009)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockRef(page)
    await page.route('**/api/store/challans?**', (r) =>
      r.fulfill({ json: envelope(CHALLAN_LIST) })
    )
    await page.goto('/store/challan')
  })

  test('renders outgoing challans with status badge', async ({ page }) => {
    await expect(
      page.getByRole('tab', { name: 'Outgoing Challans' })
    ).toBeVisible()
    const table = page.locator('.ant-table')
    await expect(table.getByText('CH-2026-0007')).toBeVisible()
    await expect(table.getByText('Draft', { exact: true })).toBeVisible()
    await expect(page.getByText('1 challans', { exact: true })).toBeVisible()
  })

  test('switching to Incoming sends toLocationId to the server', async ({
    page,
  }) => {
    const req = page.waitForRequest(
      (r) =>
        r.url().includes('/api/store/challans?') &&
        r.url().includes('toLocationId=1')
    )
    await page.getByRole('tab', { name: 'Incoming Challans' }).click()
    await req
  })

  test('row click navigates to challan detail', async ({ page }) => {
    await page.route('**/api/store/challans/7', (r) =>
      r.fulfill({ json: envelope(CHALLAN_DETAIL) })
    )
    await page.locator('.ant-table-row').first().click()
    await expect(page).toHaveURL('/store/challan/7')
  })
})

test.describe('Create Challan (STORE-010)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockRef(page)
    await page.goto('/store/challan/create')
  })

  test('rejects same source and destination', async ({ page }) => {
    // Pick an option from the just-opened dropdown (the same option text
    // repeats across the source/destination selects; .last() is the one
    // that was most recently opened).
    const pick = async (label: string, text: string) => {
      await page
        .locator('.ant-select')
        .filter({ has: page.getByLabel(label, { exact: true }) })
        .locator('.ant-select-selector')
        .click()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .last()
        .locator('.ant-select-item-option')
        .getByText(text, { exact: true })
        .click()
    }

    await pick('Source Location', 'Central Store (CST-01)')
    await pick('Destination Location', 'Central Store (CST-01)')
    await pick('Item for line 1', 'Basmati Rice (GRC-001)')
    await page.getByLabel('Transfer quantity for line 1').fill('10')

    await page.getByRole('button', { name: 'Save as Draft' }).click()
    await expect(
      page.getByText('Source and destination must be different')
    ).toBeVisible()
  })
})

test.describe('Challan Detail + Workflow (STORE-011)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockRef(page)
  })

  test('shows only the valid next action (Approve for SUBMITTED)', async ({
    page,
  }) => {
    await page.route('**/api/store/challans/7', (r) =>
      r.fulfill({ json: envelope(CHALLAN_DETAIL) })
    )
    await page.goto('/store/challan/7')
    await expect(page.getByRole('button', { name: 'Approve' })).toBeVisible()
    // Not-yet-valid actions are absent
    await expect(page.getByRole('button', { name: 'Dispatch' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
  })

  test('approve opens the per-line modal and submits approvals', async ({
    page,
  }) => {
    await page.route('**/api/store/challans/7', (r) =>
      r.fulfill({ json: envelope(CHALLAN_DETAIL) })
    )
    let approvals: unknown = null
    await page.route('**/api/store/challans/7/approve', async (r) => {
      approvals = r.request().postDataJSON()
      await r.fulfill({
        json: envelope({ ...CHALLAN_DETAIL, status: 'APPROVED' }),
      })
    })

    await page.goto('/store/challan/7')
    await page.getByRole('button', { name: 'Approve' }).click()
    // Modal appears with the requested qty prefilled; confirm
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('Approve Challan')).toBeVisible()
    await dialog.getByRole('button', { name: 'Approve' }).click()

    await expect.poll(() => Array.isArray(approvals)).toBe(true)
  })

  test('draft challan shows Submit as the next action', async ({ page }) => {
    await page.route('**/api/store/challans/7', (r) =>
      r.fulfill({ json: envelope({ ...CHALLAN_DETAIL, status: 'DRAFT' }) })
    )
    await page.goto('/store/challan/7')
    await expect(
      page.getByRole('button', { name: 'Submit for Approval' })
    ).toBeVisible()
  })
})
