'use server'

import { updateTag } from 'next/cache'
import { reorderChannels } from '@/features/message/message-store'
import { getCurrentUser } from '@/features/user/user-queries'

export type ChannelLayout = {
  groups: { name: string; channelIds: string[] }[]
}

export async function saveChannelLayout(layout: ChannelLayout) {
  const user = await getCurrentUser()
  await reorderChannels(user.id, layout)
  updateTag(`channels:${user.id}`)
}
