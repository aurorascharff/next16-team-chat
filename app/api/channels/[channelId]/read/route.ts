import { revalidateTag } from 'next/cache'
import { markChannelRead } from '@/features/message/message-store'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  const { channelId } = await params
  await markChannelRead(channelId)
  revalidateTag('channels', 'max')
  return new Response(null, { status: 204 })
}
