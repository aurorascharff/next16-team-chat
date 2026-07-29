'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { SESSION_COOKIE, USERS } from './user-data'

export async function switchUser(userId: string) {
  const cookieStore = await cookies()
  const nextUserId = USERS[userId] ? userId : 'ada'

  cookieStore.set(SESSION_COOKIE, nextUserId, {
    path: '/',
    sameSite: 'lax',
  })

  // Soft-refresh the current tree so the new user's data streams in without a
  // hard redirect (which re-renders the whole document and the theme script).
  revalidatePath('/', 'layout')
}
