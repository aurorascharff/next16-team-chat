import { revalidateTag } from 'next/cache'
import { markChannelRead } from '@/features/channel/channel-queries'
import { verifyAuth } from '@/features/user/user-queries'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  const user = await verifyAuth()
  const { channelId } = await params
  await markChannelRead(channelId, user.id)
  revalidateTag('channels', 'max')
  return new Response(null, { status: 204 })
}
