import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { cookies } from 'next/headers'
import { getFallbackUser, SESSION_COOKIE, USERS } from './user-data'

export async function getCurrentUser() {
  'use cache: private'
  cacheTag('current-user')
  cacheLife({ stale: 60 })
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value
  return userId && USERS[userId] ? USERS[userId] : getFallbackUser()
}

export async function verifyAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
