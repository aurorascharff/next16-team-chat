'use server'

import { updateTag } from 'next/cache'
import { getCurrentUser } from '@/features/user/user-queries'
import { addMessage } from './message-store'
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

  const user = await getCurrentUser()
  const message = await addMessage({
    body: text,
    channelId,
    parentId,
    userId: user.id,
  })

  if (parentId) {
    // A reply updates the thread and the parent's reply count in the channel.
    updateTag(repliesTag(parentId))
  }
  updateTag(messagesTag(channelId))

  return { message, ok: true }
}
