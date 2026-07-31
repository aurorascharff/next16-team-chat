import { revalidateTag } from 'next/cache'
import { channelTags } from '@/features/channel/channel-cache'
import { postBotMessage } from '@/features/demo/bot-queries'
import { messageTags } from '@/features/message/message-cache'

export async function POST() {
  const channelId = await postBotMessage()
  if (channelId) {
    revalidateTag(messageTags.channel(channelId), { expire: 0 })
    revalidateTag(messageTags.all, 'max')
    revalidateTag(channelTags.detail(channelId), 'max')
    revalidateTag(channelTags.unread, { expire: 0 })
  }
  return new Response(null, { status: 204 })
}
