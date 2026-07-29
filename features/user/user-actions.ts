'use server'

import { updateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, USERS } from './user-data'

export async function switchUser(userId: string) {
  const cookieStore = await cookies()
  const nextUserId = USERS[userId] ? userId : 'ada'

  cookieStore.set(SESSION_COOKIE, nextUserId, {
    path: '/',
    sameSite: 'lax',
  })

  updateTag('current-user')
}
