import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { delay } from '@/lib/utils'
import { listMessages } from './message-store'

export function messagesTag(channelId: string) {
  return `messages:${channelId}`
}

export async function getMessages(channelId: string) {
  'use cache'
  cacheTag('messages', messagesTag(channelId))
  cacheLife({ stale: 30 })
  await delay(1000)
  return listMessages(channelId)
}
