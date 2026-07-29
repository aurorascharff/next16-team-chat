import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { notFound } from 'next/navigation'
import { isSlowMode } from '@/features/demo/slow-mode'
import { getCurrentUser } from '@/features/user/user-queries'
import { delay } from '@/lib/utils'
import {
  findChannel,
  getChannelDetail as loadChannelDetail,
  listChannelLayout,
  listChannels,
  listUnreadChannels,
} from '@/features/message/message-store'

export function channelTag(channelId: string) {
  return `channel:${channelId}`
}

export async function getChannels() {
  const user = await getCurrentUser()
  return getChannelsCached(user.id, await isSlowMode())
}

export async function getChannelLayout() {
  const user = await getCurrentUser()
  return getChannelLayoutCached(user.id, await isSlowMode())
}

export async function listChannelsForUser(userId: string) {
  'use cache'
  cacheTag('channels', `channels:${userId}`)
  cacheLife('hours')
  return listChannels(userId)
}

export async function getUnreadChannels() {
  return listUnreadChannels()
}

async function getChannelsCached(userId: string, slow: boolean) {
  'use cache'
  cacheTag('channels', `channels:${userId}`)
  cacheLife('hours')
  await delay(400, slow)
  return listChannels(userId)
}

async function getChannelLayoutCached(userId: string, slow: boolean) {
  'use cache'
  cacheTag('channels', `channels:${userId}`)
  cacheLife('hours')
  await delay(400, slow)
  return listChannelLayout(userId)
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
