import { test, expect } from '@playwright/test'

test.describe('Accident detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accidents/car')
  })

  test('renders page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Car Accidents', level: 1 })).toBeVisible()
  })

  test('key content sections render', async ({ page }) => {
    // Use heading role to avoid matching TOC links with the same text
    await expect(page.getByRole('heading', { name: 'Common Causes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'What To Do Immediately' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Evidence Checklist' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Timeline Risks' })).toBeVisible()
  })

  test('disclaimer banner is present', async ({ page }) => {
    // DisclaimerBanner unique phrase
    await expect(page.getByText('AccidentPath is not a law firm').first()).toBeVisible()
  })

  test('Get Free Guidance CTA is present and links to /find-help', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Get Free Guidance' }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/find-help')
  })

  test('breadcrumb links back to accident hub', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(breadcrumb.getByRole('link', { name: 'Accident Types' })).toBeVisible()
  })
})
