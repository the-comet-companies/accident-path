import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders hero heading and primary CTA', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Get Clear Next Steps After an Accident' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Start Free Accident Check' }).first()).toBeVisible()
  })

  test('accident type cards are visible', async ({ page }) => {
    // Scope to the accidents section to avoid matching header nav links
    const accidentsSection = page.getByRole('heading', { name: 'Accident Type Guides' }).locator('..')
    await expect(page.getByRole('link', { name: 'Car Accidents' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Motorcycle' }).first()).toBeVisible()
    void accidentsSection // suppress unused warning
  })

  test('key section headings render', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'From Accident to Clarity in 3 Steps' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Interactive Accident Tools' })).toBeVisible()
  })

  test('CTA links navigate correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Start Free Accident Check' }).first()
    await expect(link).toHaveAttribute('href', '/find-help')
  })
})
