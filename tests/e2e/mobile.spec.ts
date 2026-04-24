import { test, expect } from '@playwright/test'

// Force mobile viewport for all tests in this file (avoids defaultBrowserType conflict with chromium project)
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

test.describe('Mobile nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hamburger button is visible on mobile', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
  })

  test('mobile nav opens and shows links', async ({ page }) => {
    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    const drawer = page.getByRole('dialog', { name: 'Navigation menu' })
    await expect(drawer).toBeVisible()
    // Scope link checks to drawer to avoid matching other page links
    await expect(drawer.getByRole('link', { name: 'Find Help' })).toBeVisible()
    await expect(drawer.getByRole('link', { name: 'Tools', exact: true })).toBeVisible()
  })
})

test.describe('Mobile layout', () => {
  test('home page renders without horizontal overflow', async ({ page }) => {
    await page.goto('/')
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('intake page is usable on mobile', async ({ page }) => {
    await page.goto('/find-help')
    await expect(page.getByRole('button', { name: 'Car Accident' })).toBeVisible()
  })
})
