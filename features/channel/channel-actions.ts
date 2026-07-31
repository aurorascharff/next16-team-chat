'use server'

import { updateTag } from 'next/cache'
import {
  lastReadTag,
  markChannelRead,
} from '@/features/channel/channel-queries'
import { verifyAuth } from '@/features/user/user-queries'

export async function markChannelReadAction(channelId: string) {
  const user = await verifyAuth()
  const result = await markChannelRead(channelId, user.id)

  if (result.changed) {
    updateTag(lastReadTag(channelId, user.id))
    updateTag('channels:unread')
  }

  return result.readAt
}
