import { test, expect } from '@playwright/test'

test.describe('Intake wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock intake API to avoid real Supabase writes
    await page.route('/api/intake', route =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    )
    await page.goto('/find-help')
  })

  test('renders first step', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Car Accident' })).toBeVisible()
  })

  test('completes all 9 steps and reaches thank-you page', async ({ page }) => {
    // Step 1 — accident type (auto-advances on click)
    await page.getByRole('button', { name: 'Car Accident' }).click()

    // Step 2 — when (date input)
    await page.fill('#accident-date', '2026-01-15')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 3 — where (state + city)
    await page.getByRole('button', { name: 'California' }).click()
    await page.fill('#city-input', 'Los Angeles')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 4 — injuries (multiselect, pick one)
    await page.getByRole('button', { name: 'Neck / Back' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 5 — medical (auto-advances)
    await page.getByRole('button', { name: /Doctor visit/i }).click()

    // Step 6 — police report (auto-advances)
    await page.getByRole('button', { name: 'Yes' }).click()

    // Step 7 — insurance (auto-advances)
    await page.getByRole('button', { name: /I have insurance/i }).click()

    // Step 8 — work impact (auto-advances)
    await page.getByRole('button', { name: /No work impact/i }).click()

    // Step 9 — contact + submit (checkbox is sr-only, use force)
    await page.locator('#tcpa-consent').check({ force: true })
    await page.fill('#contact-name', 'Test User')
    await page.fill('#contact-email', 'test@example.com')
    await page.getByRole('button', { name: /See My Results/i }).click()

    await expect(page).toHaveURL('/find-help/thank-you')
    await expect(page.getByRole('heading', { name: "We've Received Your Information" })).toBeVisible()
  })
})
