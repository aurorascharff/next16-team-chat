import { revalidateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import { markActivityRead } from '@/features/workspace/workspace-queries'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const user = await verifyAuth()
  const { itemId } = await params
  await markActivityRead(user.id, itemId)
  revalidateTag(`activity-reads:${user.id}`, { expire: 0 })
  return new Response(null, { status: 204 })
}
