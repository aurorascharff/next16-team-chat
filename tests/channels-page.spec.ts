import { instant } from '@next/playwright'
import { expect, test } from '@playwright/test'

test.use({ viewport: { height: 844, width: 390 } })

test.describe('Channels page (/channels)', () => {
  test('initial load keeps the mobile shell around streamed channels', async ({
    baseURL,
    page,
  }) => {
    await instant(
      page,
      async () => {
        await page.goto('/channels')
        await expect(
          page.getByRole('link', { name: 'Huddle Team workspace' }),
        ).toBeVisible()
        await expect(
          page.getByRole('main').getByLabel('Loading channels'),
        ).toBeVisible()
        await expect(
          page.locator('nav[aria-label="Primary"]:visible'),
        ).toBeVisible()
      },
      { baseURL },
    )
  })

  test('client navigation reveals the channel index immediately', async ({
    page,
  }) => {
    await page.goto('/activity')
    const home = page.locator('a[href="/channels"]:visible').first()
    await home.waitFor({ state: 'visible' })

    await instant(page, async () => {
      await home.click()
      await page.waitForURL((url) => url.pathname === '/channels')
      await expect(
        page.getByRole('main').getByRole('navigation', { name: 'Channels' }),
      ).toBeVisible()
    })
  })
})
