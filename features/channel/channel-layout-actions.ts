'use server'

import { updateTag } from 'next/cache'
import {
  applyLayoutAction,
  type LayoutAction,
  type LayoutGroup,
  toLayoutPayload,
} from '@/features/channel/channel-layout-reducer'
import { reorderChannels } from '@/features/channel/channel-queries'
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
