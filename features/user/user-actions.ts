'use server'

import { updateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getUsers, SESSION_COOKIE } from './user-queries'

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

  updateTag('current-user')
  updateTag('channels')
  updateTag('mentions')

  const channels = await listChannelsForUser(nextUserId)
  return channels[0] ? `/channel/${channels[0].id}` : '/channels'
}
