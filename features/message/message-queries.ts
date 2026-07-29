import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { delay } from '@/lib/utils'
import { listMessages, listReplies } from './message-store'

export function messagesTag(channelId: string) {
  return `messages:${channelId}`
}

export function repliesTag(messageId: string) {
  return `replies:${messageId}`
}

export async function getMessages(channelId: string) {
  'use cache'
  cacheTag('messages', messagesTag(channelId))
  cacheLife({ stale: 30 })
  await delay(1000)
  return listMessages(channelId)
}

export async function getReplies(messageId: string) {
  'use cache'
  cacheTag('replies', repliesTag(messageId))
  cacheLife({ stale: 30 })
  await delay(500)
  return listReplies(messageId)
}
