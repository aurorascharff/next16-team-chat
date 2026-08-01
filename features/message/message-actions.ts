'use server'

import { revalidateTag, updateTag } from 'next/cache'
import { after } from 'next/server'
import { channelTags } from '@/features/channel/channel-cache'
import { replyAsBotIfMentioned } from '@/features/demo/bot-replies'
import { verifyAuth } from '@/features/user/user-queries'
import { messageTags } from './message-cache'
import { addMessage, toggleReaction } from './message-queries'

export type SendMessageResult =
  | { ok: true; message: Awaited<ReturnType<typeof addMessage>> }
  | { ok: false; error: string }

export async function sendMessage({
  body,
  channelId,
  parentId,
}: {
  body: string
  channelId: string
  parentId?: string
}): Promise<SendMessageResult> {
  const text = body.trim()

  if (text.length < 1) {
    return { error: 'Write a message first.', ok: false }
  }

  if (text.length > 280) {
    return { error: 'Keep messages under 280 characters.', ok: false }
  }

  const user = await verifyAuth()
  const message = await addMessage({
    body: text,
    channelId,
    parentId,
    userId: user.id,
  })

  if (parentId) {
    updateTag(messageTags.replies(parentId))
  }
  updateTag(messageTags.channel(channelId))
  updateTag(messageTags.all)
  updateTag(channelTags.unread)

  after(async () => {
    const botThread = await replyAsBotIfMentioned({
      authorId: user.id,
      body: text,
      channelId,
      messageId: message.id,
      parentId,
    })

    if (!botThread) return
    revalidateTag(messageTags.replies(botThread), { expire: 0 })
    revalidateTag(messageTags.channel(channelId), { expire: 0 })
    revalidateTag(messageTags.all, { expire: 0 })
    revalidateTag(channelTags.unread, { expire: 0 })
  })

  return { message, ok: true }
}

export async function reactToMessage({
  channelId,
  emoji,
  messageId,
  parentId,
}: {
  channelId: string
  emoji: string
  messageId: string
  parentId?: string
}) {
  const user = await verifyAuth()
  await toggleReaction({ emoji, messageId, userId: user.id })

  if (parentId) {
    updateTag(messageTags.replies(parentId))
  }
  updateTag(messageTags.channel(channelId))
}
