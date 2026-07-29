import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { isSlowMode } from '@/features/demo/slow-mode'
import { delay } from '@/lib/utils'
import { listMessages, listReplies } from './message-store'

export function messagesTag(channelId: string) {
  return `messages:${channelId}`
}

export function repliesTag(messageId: string) {
  return `replies:${messageId}`
}

export async function getMessages(channelId: string) {
  return getMessagesCached(channelId, await isSlowMode())
}

export async function getMessagesCached(channelId: string, slow: boolean) {
  'use cache'
  cacheTag('messages', messagesTag(channelId))
  cacheLife({ stale: 30 })
  await delay(1000, slow)
  return listMessages(channelId)
}

export async function getReplies(messageId: string) {
  return getRepliesCached(messageId, await isSlowMode())
}

async function getRepliesCached(messageId: string, slow: boolean) {
  'use cache'
  cacheTag('replies', repliesTag(messageId))
  cacheLife({ stale: 30 })
  await delay(500, slow)
  return listReplies(messageId)
}
