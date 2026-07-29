import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { notFound } from 'next/navigation'
import { delay } from '@/lib/utils'
import { findChannel, listChannels } from '@/features/message/message-store'

export function channelTag(channelId: string) {
  return `channel:${channelId}`
}

export async function getChannels() {
  'use cache'
  cacheTag('channels')
  cacheLife('hours')
  await delay(400)
  return listChannels()
}

export async function getChannel(channelId: string) {
  'use cache'
  cacheTag('channels', channelTag(channelId))
  cacheLife('hours')
  await delay(700)
  const channel = findChannel(channelId)
  if (!channel) notFound()
  return channel
}
