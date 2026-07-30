import { revalidateTag } from 'next/cache'
import { channelTag } from '@/features/channel/channel-queries'
import { postBotMessage } from '@/features/demo/bot-queries'
import { messagesTag } from '@/features/message/message-queries'

export async function POST() {
  const channelId = await postBotMessage()
  if (channelId) {
    revalidateTag(messagesTag(channelId), 'max')
    revalidateTag('messages', 'max')
    revalidateTag(channelTag(channelId), 'max')
    revalidateTag('channels:unread', { expire: 0 })
  }
  return new Response(null, { status: 204 })
}
