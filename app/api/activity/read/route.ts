import { revalidateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import { markActivityItemsRead } from '@/features/workspace/workspace-queries'

export async function POST(request: Request) {
  const user = await verifyAuth()
  const body = (await request.json().catch(() => null)) as {
    itemIds?: unknown
  } | null
  const itemIds = Array.isArray(body?.itemIds)
    ? body.itemIds.filter((itemId): itemId is string => {
        return typeof itemId === 'string'
      })
    : []

  await markActivityItemsRead(user.id, itemIds)
  revalidateTag(`activity-reads:${user.id}`, { expire: 0 })
  return new Response(null, { status: 204 })
}
