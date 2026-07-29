import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { isSlowMode } from '@/features/demo/slow-mode'
import { getCurrentUser } from '@/features/user/user-queries'
import { delay } from '@/lib/utils'
import { listMessages, listReplies } from './message-store'

export function messagesTag(channelId: string) {
  return `messages:${channelId}`
}

export function repliesTag(messageId: string) {
  return `replies:${messageId}`
}

export async function getMessages(channelId: string) {
  const user = await getCurrentUser()
  return getMessagesCached(channelId, user.id, await isSlowMode())
}

export async function getMessagesCached(
  channelId: string,
  userId: string,
  slow: boolean,
) {
  'use cache'
  cacheTag('messages', messagesTag(channelId))
  cacheLife({ stale: 30 })
  await delay(1000, slow)
  return listMessages(channelId, userId)
}

export async function getReplies(messageId: string) {
  const user = await getCurrentUser()
  return getRepliesCached(messageId, user.id, await isSlowMode())
}

async function getRepliesCached(
  messageId: string,
  userId: string,
  slow: boolean,
) {
  'use cache'
  cacheTag('replies', repliesTag(messageId))
  cacheLife({ stale: 30 })
  await delay(500, slow)
  return listReplies(messageId, userId)
}
