import { test, expect } from '@playwright/test'

test.describe('State page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/states/california')
  })

  test('renders state heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'California Personal Injury Guide', level: 1 })).toBeVisible()
  })

  test('key legal sections render', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Statute of Limitations' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Fault Rule/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Insurance Minimums' })).toBeVisible()
  })

  test('California Cities section renders with city links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'California Cities' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Los Angeles/i }).first()).toBeVisible()
  })

  test('Get Free Guidance CTA links to /find-help', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Get Free Guidance' }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/find-help')
  })
})
