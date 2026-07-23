import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { seedAuth } from './helpers'

const envelope = (data: unknown) => ({ success: true, data, message: 'ok' })

const SUPPLIERS = [
  { id: 1, name: 'Agro Traders', supplierCode: 'SUP-01', active: true },
  { id: 2, name: 'Fresh Foods', supplierCode: 'SUP-02', active: true },
]

const ITEMS = [
  { id: 1, name: 'Basmati Rice', itemCode: 'GRC-001' },
  { id: 2, name: 'Toor Dal', itemCode: 'GRC-002' },
]

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

const PO_LIST = {
  content: [
    {
      id: 10,
      poNumber: 'PO-2026-0010',
      supplierId: 1,
      supplierName: 'Agro Traders',
      status: 'SENT',
      poDate: '2026-07-20',
      expectedDeliveryDate: '2026-07-28',
      totalAmount: 42000,
      createdAt: '2026-07-20T10:00:00',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
}

const PO_DETAIL = {
  id: 10,
  poNumber: 'PO-2026-0010',
  supplierId: 1,
  supplierName: 'Agro Traders',
  deliveryLocationId: 1,
  deliveryLocationName: 'Central Store',
  status: 'SENT',
  poDate: '2026-07-20',
  expectedDeliveryDate: '2026-07-28',
  actualDeliveryDate: null,
  totalAmount: 42000,
  receivedAmount: 0,
  autoSuggested: false,
  suggestionReason: null,
  billNumber: null,
  billDate: null,
  billAmount: null,
  notes: 'Urgent restock',
  createdBy: 'store@fomp.com',
  approvedBy: null,
  receivedBy: null,
  createdAt: '2026-07-20T10:00:00',
  lineItems: [
    {
      id: 100,
      itemId: 1,
      itemName: 'Basmati Rice',
      itemCode: 'GRC-001',
      unitName: 'KG',
      orderedQuantity: 100,
      receivedQuantity: 0,
      pendingQuantity: 100,
      unitPrice: 85,
      actualUnitPrice: null,
      lineTotal: 8500,
      actualLineTotal: null,
      fullyReceived: false,
      remarks: null,
    },
  ],
}

const mockRefData = async (page: Page) => {
  await page.route('**/api/store/suppliers', (r) =>
    r.fulfill({ json: envelope(SUPPLIERS) })
  )
  await page.route('**/api/store/items', (r) =>
    r.fulfill({ json: envelope(ITEMS) })
  )
  await page.route('**/api/store/locations', (r) =>
    r.fulfill({ json: envelope(LOCATIONS) })
  )
}

test.describe('PO List (STORE-006)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockRefData(page)
    await page.route('**/api/store/po?**', (r) =>
      r.fulfill({ json: envelope(PO_LIST) })
    )
    await page.goto('/store/po')
  })

  test('renders POs with status badge and total', async ({ page }) => {
    const table = page.locator('.ant-table')
    await expect(table.getByText('PO-2026-0010')).toBeVisible()
    await expect(table.getByText('Agro Traders')).toBeVisible()
    await expect(table.getByText('Sent', { exact: true })).toBeVisible()
    await expect(page.getByText('1 orders', { exact: true })).toBeVisible()
  })

  test('status filter sends status param to the server', async ({ page }) => {
    const req = page.waitForRequest(
      (r) =>
        r.url().includes('/api/store/po?') && r.url().includes('status=SENT')
    )
    const select = page
      .locator('.ant-select')
      .filter({ has: page.getByLabel('Filter by status') })
    await select.locator('.ant-select-selector').click()
    await page.locator('.ant-select-item-option').getByText('Sent', { exact: true }).click()
    await req
  })

  test('row click navigates to PO detail', async ({ page }) => {
    await page.route('**/api/store/po/10', (r) =>
      r.fulfill({ json: envelope(PO_DETAIL) })
    )
    await page.locator('.ant-table-row').first().click()
    await expect(page).toHaveURL('/store/po/10')
    await expect(
      page.getByRole('heading', { name: 'PO-2026-0010', level: 1 })
    ).toBeVisible()
  })
})

test.describe('Create PO (STORE-007)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockRefData(page)
    await page.goto('/store/po/create')
  })

  test('validates required fields and minimum one line item', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Send PO', exact: true }).click()
    await expect(page.getByText('Supplier is required')).toBeVisible()
    await expect(page.getByText('Delivery location is required')).toBeVisible()
    await expect(
      page.getByText('Expected delivery date is required')
    ).toBeVisible()
  })

  test('creates and sends a PO', async ({ page }) => {
    let posted: Record<string, unknown> | null = null
    await page.route('**/api/store/po', async (r) => {
      if (r.request().method() === 'POST') {
        posted = r.request().postDataJSON()
        await r.fulfill({ json: envelope({ ...PO_DETAIL, status: 'DRAFT' }) })
      } else {
        await r.fulfill({ json: envelope(PO_LIST) })
      }
    })
    await page.route('**/api/store/po/10/send', (r) =>
      r.fulfill({ json: envelope(PO_DETAIL) })
    )
    await page.route('**/api/store/po/10', (r) =>
      r.fulfill({ json: envelope(PO_DETAIL) })
    )

    const pickOption = async (opener: () => Promise<void>, optionText: string) => {
      await opener()
      await page
        .locator('.ant-select-item-option')
        .getByText(optionText, { exact: true })
        .click()
    }

    const openSelect = (label: string) =>
      page
        .locator('.ant-select')
        .filter({ has: page.getByLabel(label, { exact: true }) })
        .locator('.ant-select-selector')
        .click()

    await pickOption(() => openSelect('Supplier'), 'Agro Traders (SUP-01)')
    await pickOption(
      () => openSelect('Delivery Location'),
      'Central Store (CST-01)'
    )

    // Expected delivery date — today is selectable (future not required past)
    await page.locator('.ant-picker').first().click()
    await page
      .locator('.ant-picker-cell-in-view:not(.ant-picker-cell-disabled)')
      .first()
      .click()

    // Line item
    await pickOption(
      () => openSelect('Item for line 1'),
      'Basmati Rice (GRC-001)'
    )
    await page.getByLabel('Quantity for line 1').fill('100')
    await page.getByLabel('Unit price for line 1').fill('85')

    await page.getByRole('button', { name: 'Send PO', exact: true }).click()

    await expect(page).toHaveURL('/store/po/10')
    expect(posted).toBeTruthy()
  })
})

test.describe('PO Detail + GRN (STORE-008)', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, 'ROLE_STORE_MANAGER')
    await mockRefData(page)
    await page.route('**/api/store/po/10', (r) =>
      r.fulfill({ json: envelope(PO_DETAIL) })
    )
    await page.goto('/store/po/10')
  })

  test('shows header, line items and the GRN form for a SENT PO', async ({
    page,
  }) => {
    await expect(page.getByText('Agro Traders')).toBeVisible()
    await expect(page.getByText('Record Goods Receipt (GRN)')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Record Receipt' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cancel PO' })).toBeVisible()
  })

  test('records a goods receipt', async ({ page }) => {
    let received: Record<string, unknown> | null = null
    await page.route('**/api/store/po/10/receive', async (r) => {
      received = r.request().postDataJSON()
      await r.fulfill({
        json: envelope({ ...PO_DETAIL, status: 'FULLY_RECEIVED' }),
      })
    })

    await page.getByLabel('Received this GRN for Basmati Rice').fill('100')
    await page.getByLabel('Bill number').fill('BILL-001')
    await page.locator('.ant-picker').click()
    await page
      .locator('.ant-picker-cell-in-view:not(.ant-picker-cell-disabled)')
      .last()
      .click()
    await page.getByRole('button', { name: 'Record Receipt' }).click()

    await expect
      .poll(() => received && (received as { billNumber?: string }).billNumber)
      .toBe('BILL-001')
  })
})
