'use server'

import { updateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { channelTags } from '@/features/channel/channel-cache'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { userTags } from './user-cache'
import { LAST_CHANNEL_COOKIE, SESSION_COOKIE } from './session'
import { getUsers } from './user-queries'

export async function switchUser(userId: string) {
  const cookieStore = await cookies()
  const users = await getUsers()
  const nextUserId = users.some((user) => user.id === userId)
    ? userId
    : users[0].id

  cookieStore.set(SESSION_COOKIE, nextUserId, {
    path: '/',
    sameSite: 'lax',
  })

  updateTag(userTags.current)
  updateTag(channelTags.all)

  const channels = await listChannelsForUser(nextUserId)
  const firstChannel = channels[0]

  if (firstChannel) {
    cookieStore.set(LAST_CHANNEL_COOKIE, firstChannel.id, {
      path: '/',
      sameSite: 'lax',
    })
  } else {
    cookieStore.delete(LAST_CHANNEL_COOKIE)
  }

  return firstChannel ? `/channel/${firstChannel.id}` : '/channels'
}
