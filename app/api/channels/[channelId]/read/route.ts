import { revalidateTag } from 'next/cache'
import {
  lastReadTag,
  markChannelRead,
} from '@/features/channel/channel-queries'
import { verifyAuth } from '@/features/user/user-queries'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  const user = await verifyAuth()
  const { channelId } = await params
  const changed = await markChannelRead(channelId, user.id)
  if (changed) {
    revalidateTag(lastReadTag(channelId, user.id), 'max')
    revalidateTag('channels:unread', 'max')
  }
  return new Response(null, { status: 204 })
}
