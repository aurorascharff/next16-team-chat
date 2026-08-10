import { expect, test } from '@playwright/test'

test.use({ viewport: { height: 844, width: 390 } })

test.describe('Home page (/)', () => {
  test('initial load redirects to the first channel', async ({ page }) => {
    await page.goto('/')

    await page.waitForURL((url) => url.pathname.startsWith('/channel/'))
    await expect(
      page.locator('nav[aria-label="Primary"]:visible'),
    ).toBeVisible()
  })

  test('client navigation follows the home redirect', async ({ page }) => {
    await page.goto('/channels')
    const home = page.locator('a[href="/"]:visible').first()

    await home.click()
    await page.waitForURL((url) => url.pathname.startsWith('/channel/'))
    await expect(
      page.locator('nav[aria-label="Primary"]:visible'),
    ).toBeVisible()
  })
})
