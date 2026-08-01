import { instant } from '@next/playwright'
import { expect, test } from '@playwright/test'

test.describe('Activity page (/activity)', () => {
  test('initial load keeps the header while activity streams', async ({
    baseURL,
    page,
  }) => {
    await instant(
      page,
      async () => {
        await page.goto('/activity')
        await expect(
          page.getByRole('heading', { name: 'Activity' }),
        ).toBeVisible()
        await expect(
          page.locator('nav[aria-label="Primary"]:visible'),
        ).toBeVisible()
      },
      { baseURL },
    )
  })

  test('client navigation reveals the activity page immediately', async ({
    page,
  }) => {
    await page.goto('/channels')
    const link = page.locator('a[href="/activity"]:visible').first()
    await link.waitFor({ state: 'visible' })

    await instant(page, async () => {
      await link.click()
      await page.waitForURL((url) => url.pathname === '/activity')
      await expect(
        page.getByRole('heading', { name: 'Activity' }),
      ).toBeVisible()
    })
  })
})
