import { instant } from '@next/playwright'
import { expect, test } from '@playwright/test'

test.use({ viewport: { height: 844, width: 390 } })

test.describe('Search page (/search)', () => {
  test('initial load shows the search shell', async ({ baseURL, page }) => {
    await instant(
      page,
      async () => {
        await page.goto('/search')
        await expect(
          page.getByRole('textbox', { name: 'Search channels and messages…' }),
        ).toBeVisible()
        await expect(page.locator('[aria-busy="true"]')).toBeVisible()
        await expect(
          page.locator('nav[aria-label="Primary"]:visible'),
        ).toBeVisible()
      },
      { baseURL },
    )
  })

  test('client navigation reveals search immediately', async ({ page }) => {
    await page.goto('/channels')
    const search = page.locator('a[href="/search"]:visible').first()
    await search.waitFor({ state: 'visible' })

    await instant(page, async () => {
      await search.click()
      await page.waitForURL((url) => url.pathname === '/search')
      await expect(
        page.getByRole('textbox', { name: 'Search channels and messages…' }),
      ).toBeFocused()
    })
  })

})
