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

  test('typing stays responsive while deferred results load', async ({
    page,
  }) => {
    await page.goto('/search')
    const input = page.getByRole('textbox', {
      name: 'Search channels and messages…',
    })
    const initialResult = page.getByRole('button', {
      name: 'proj-ship-room NOW',
    })
    await expect(initialResult).toBeVisible()

    let releaseRequests = () => {}
    const requestsReleased = new Promise<void>((resolve) => {
      releaseRequests = resolve
    })
    await page.route(
      /\/api\/(channels|messages\/search)\?q=team$/,
      async (route) => {
        await requestsReleased
        await route.continue()
      },
    )

    await input.fill('team')

    await expect(input).toHaveValue('team')
    await expect(initialResult).toBeVisible()
    await expect(page.locator('ul[aria-busy="true"]')).toBeVisible()

    releaseRequests()
    await expect(
      page.getByRole('button', { name: 'team-design DAILY' }),
    ).toBeVisible()
    await expect(initialResult).toHaveCount(0)
  })
})
