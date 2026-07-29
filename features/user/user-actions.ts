'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Route } from 'next'
import { SESSION_COOKIE, USERS } from './user-data'

function safePath(value: string) {
  return value.startsWith('/') ? value : '/channel/ship-room'
}

export async function switchUser(userId: string, nextPath: string) {
  const cookieStore = await cookies()
  const nextUserId = USERS[userId] ? userId : 'ada'

  cookieStore.set(SESSION_COOKIE, nextUserId, {
    path: '/',
    sameSite: 'lax',
  })

  redirect(safePath(nextPath) as Route)
}
