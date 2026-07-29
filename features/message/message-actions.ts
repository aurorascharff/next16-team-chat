'use server'

import { updateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import { addMessage, toggleReaction } from './message-store'
import { messagesTag, repliesTag } from './message-queries'

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
    updateTag(repliesTag(parentId))
  }
  updateTag(messagesTag(channelId))

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
    updateTag(repliesTag(parentId))
  }
  updateTag(messagesTag(channelId))
}
