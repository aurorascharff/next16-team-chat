import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { notFound } from 'next/navigation'
import { isSlowMode } from '@/features/demo/slow-mode'
import { delay } from '@/lib/utils'
import {
  findChannel,
  getChannelDetail as loadChannelDetail,
  listChannels,
  listUnreadChannels,
} from '@/features/message/message-store'

export function channelTag(channelId: string) {
  return `channel:${channelId}`
}

export async function getChannels() {
  return getChannelsCached(await isSlowMode())
}

export async function getUnreadChannels() {
  return listUnreadChannels()
}

async function getChannelsCached(slow: boolean) {
  'use cache'
  cacheTag('channels')
  cacheLife('hours')
  await delay(400, slow)
  return listChannels()
}

export async function getChannel(channelId: string) {
  return getChannelCached(channelId, await isSlowMode())
}

async function getChannelCached(channelId: string, slow: boolean) {
  'use cache'
  cacheTag('channels', channelTag(channelId))
  cacheLife('hours')
  await delay(700, slow)
  const channel = await findChannel(channelId)
  if (!channel) notFound()
  return channel
}

export async function getChannelDetails(channelId: string) {
  return getChannelDetailsCached(channelId, await isSlowMode())
}

async function getChannelDetailsCached(channelId: string, slow: boolean) {
  'use cache'
  cacheTag('channels', channelTag(channelId))
  cacheLife('hours')
  await delay(900, slow)
  const channel = await loadChannelDetail(channelId)
  if (!channel) notFound()
  return channel
}
