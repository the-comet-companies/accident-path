import { test, expect } from '@playwright/test'

test.describe('Tool — accident case quiz', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/accident-case-quiz')
  })

  test('renders tool heading and disclaimer', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'What Kind of Accident Case Do I Have?' })).toBeVisible()
    await expect(page.getByText('general educational information only').first()).toBeVisible()
  })

  test('completes quiz and renders results with disclaimer', async ({ page }) => {
    // Step 1 — accident type (select: click option then Next)
    await page.getByRole('button', { name: 'Car Accident' }).first().click()
    await page.getByRole('button', { name: 'Next →' }).click()

    // Step 2 — what happened (multiselect)
    await page.getByRole('button', { name: 'Rear-end collision' }).click()
    await page.getByRole('button', { name: 'Next →' }).click()

    // Step 3 — injuries (checklist)
    await page.getByRole('button', { name: 'Whiplash / Neck Injury' }).click()
    await page.getByRole('button', { name: 'Next →' }).click()

    // Step 4 — timeline (select)
    await page.getByRole('button', { name: '1–7 days ago' }).click()
    await page.getByRole('button', { name: 'Next →' }).click()

    // Step 5 — witnesses (select, last step)
    await page.getByRole('button', { name: 'Yes — multiple witnesses' }).click()
    await page.getByRole('button', { name: 'See My Results →' }).click()

    // Results should render
    await expect(page.getByText('general educational information only').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start Over' })).toBeVisible()
  })
})
