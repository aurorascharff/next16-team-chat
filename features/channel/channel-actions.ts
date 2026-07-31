'use server'

import { updateTag } from 'next/cache'
import {
  lastReadTag,
  markChannelRead,
  reorderChannels,
} from '@/features/channel/channel-queries'
import {
  applyLayoutAction,
  type LayoutAction,
  type LayoutGroup,
  toLayoutPayload,
} from '@/features/channel/utils/channel-layout-reducer'
import { verifyAuth } from '@/features/user/user-queries'

export async function channelLayoutReducer(
  groups: LayoutGroup[],
  action: LayoutAction,
): Promise<LayoutGroup[]> {
  const user = await verifyAuth()
  const next = applyLayoutAction(groups, action)
  await reorderChannels(user.id, toLayoutPayload(next))
  updateTag(`channels:${user.id}`)
  return next
}

export async function markChannelReadAction(channelId: string) {
  const user = await verifyAuth()
  const result = await markChannelRead(channelId, user.id)

  if (result.changed) {
    updateTag(lastReadTag(channelId, user.id))
    updateTag('channels:unread')
  }

  return result.readAt
}
