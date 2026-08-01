import { instant } from '@next/playwright'
import { expect, test } from '@playwright/test'

test.use({ viewport: { height: 844, width: 390 } })

test.describe('Home page (/)', () => {
  test('initial load keeps the workspace shell during the redirect', async ({
    baseURL,
    page,
  }) => {
    await instant(
      page,
      async () => {
        await page.goto('/')
        await expect(
          page.locator('nav[aria-label="Primary"]:visible'),
        ).toBeVisible()
      },
      { baseURL },
    )
  })

  test('client navigation follows the home redirect', async ({ page }) => {
    await page.goto('/channels')
    const home = page.locator('a[href="/"]:visible').first()

    await instant(page, async () => {
      await home.click()
      await page.waitForURL((url) => url.pathname === '/')
      await expect(
        page.locator('nav[aria-label="Primary"]:visible'),
      ).toBeVisible()
    })

    await page.waitForURL((url) => url.pathname.startsWith('/channel/'))
  })
})
