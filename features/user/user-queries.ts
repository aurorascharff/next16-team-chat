import 'server-only'

import { cacheLife } from 'next/cache'
import { cookies } from 'next/headers'
import { getFallbackUser, SESSION_COOKIE, USERS } from './user-data'

export async function getCurrentUser() {
  'use cache: private'
  cacheLife({ stale: 60 })
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value
  return userId && USERS[userId] ? USERS[userId] : getFallbackUser()
}
