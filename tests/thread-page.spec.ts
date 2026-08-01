import { instant } from '@next/playwright'
import { expect, test, type Page } from '@playwright/test'

async function getThreadLink(page: Page) {
  await page.goto('/channel/proj-ship-room')
  const link = page.locator('a[aria-label="Reply in thread"]').first()
  await link.waitFor({ state: 'visible' })
  const href = await link.getAttribute('href')
  if (!href) throw new Error('Expected the thread link to have an href')
  return { href, link }
}

test.describe('Thread page (/channel/[channelId]/thread/[messageId])', () => {
  test('initial load keeps the panel around the streamed thread', async ({
    baseURL,
    page,
  }) => {
    const { href } = await getThreadLink(page)

    await instant(
      page,
      async () => {
        await page.goto(href)
        await expect(
          page.getByRole('complementary', { name: 'Thread' }),
        ).toBeVisible()
        await expect(page.getByLabel('Loading thread')).toBeVisible()
      },
      { baseURL },
    )
  })

  test('intent-prefetched client navigation reveals the thread immediately', async ({
    page,
  }) => {
    const { href, link } = await getThreadLink(page)
    await link.hover()

    await instant(page, async () => {
      await link.click()
      await page.waitForURL((url) => url.pathname === href)
      await expect(
        page.getByRole('complementary', { name: 'Thread' }),
      ).toBeVisible()
      await expect(page.getByPlaceholder('Reply…')).toBeVisible()
    })
  })
})
