import { revalidateTag } from 'next/cache'
import { postBotMessage } from '@/features/demo/bot-queries'
import { messagesTag } from '@/features/message/message-queries'

export async function POST() {
  const channelId = await postBotMessage()
  if (channelId) {
    revalidateTag(messagesTag(channelId), 'max')
    revalidateTag('messages', 'max')
    revalidateTag('channels', 'max')
  }
  return new Response(null, { status: 204 })
}
