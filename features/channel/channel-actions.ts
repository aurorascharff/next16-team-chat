'use server'

import { updateTag } from 'next/cache'
import { channelTags } from '@/features/channel/channel-cache'
import {
  markChannelRead,
  reorderChannels,
} from '@/features/channel/channel-queries'
import {
  applyLayoutChange,
  type LayoutChange,
  type LayoutGroup,
  toLayoutPayload,
} from '@/features/channel/utils/channel-layout-reducer'
import { verifyAuth } from '@/features/user/user-queries'

export async function channelLayoutReducer(
  groups: LayoutGroup[],
  change: LayoutChange,
): Promise<LayoutGroup[]> {
  const user = await verifyAuth()
  const next = applyLayoutChange(groups, change)
  await reorderChannels(user.id, toLayoutPayload(next))
  updateTag(channelTags.user(user.id))
  return next
}

export async function markChannelReadAction(channelId: string) {
  const user = await verifyAuth()
  const result = await markChannelRead(channelId, user.id)

  if (result.changed) {
    updateTag(channelTags.lastRead(channelId, user.id))
    updateTag(channelTags.unread)
  }

  return result.readAt
}
