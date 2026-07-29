'use server'

import { updateTag } from 'next/cache'
import { getCurrentUser } from '@/features/user/user-queries'
import { addMessage } from './message-store'
import { messagesTag } from './message-queries'

export type SendMessageResult =
  | { ok: true; message: Awaited<ReturnType<typeof addMessage>> }
  | { ok: false; error: string }

export async function sendMessage({
  body,
  channelId,
}: {
  body: string
  channelId: string
}): Promise<SendMessageResult> {
  const text = body.trim()

  if (text.length < 1) {
    return { error: 'Write a message first.', ok: false }
  }

  if (text.length > 280) {
    return { error: 'Keep messages under 280 characters.', ok: false }
  }

  const user = await getCurrentUser()
  const message = await addMessage({ body: text, channelId, userId: user.id })

  updateTag(messagesTag(channelId))

  return { message, ok: true }
}
