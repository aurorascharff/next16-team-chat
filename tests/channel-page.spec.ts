import { instant } from '@next/playwright'
import { expect, test } from '@playwright/test'

const channelPath = '/channel/proj-ship-room'

test.describe('Channel page (/channel/[channelId])', () => {
  test('initial load keeps the shell and composer around streamed messages', async ({
    baseURL,
    page,
  }) => {
    await instant(
      page,
      async () => {
        await page.goto(channelPath)
        await expect(
          page.locator('nav[aria-label="Primary"]:visible'),
        ).toBeVisible()
        await expect(
          page.locator('section[aria-label="Messages"][aria-hidden="true"]'),
        ).toBeVisible()
        await expect(page.getByPlaceholder('Message channel')).toBeVisible()
      },
      { baseURL },
    )
  })

  test('intent-prefetched client navigation reveals the channel immediately', async ({
    page,
  }) => {
    await page.goto('/channels')
    const channel = page.locator(`a[href="${channelPath}"]`).first()
    await channel.waitFor({ state: 'visible' })
    await channel.hover()

    await instant(page, async () => {
      await channel.click()
      await page.waitForURL((url) => url.pathname === channelPath)
      await expect(
        page.getByRole('heading', { name: 'proj-ship-room', exact: true }),
      ).toBeVisible()
      await expect(page.locator('section[aria-label="Messages"]')).toBeVisible()
      await expect(page.getByPlaceholder('Message channel')).toBeVisible()
    })
  })
})
