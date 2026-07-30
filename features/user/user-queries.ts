import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { cookies } from 'next/headers'
import type { User } from '@/features/user/types/user'
import { prisma } from '@/lib/db'

export const SESSION_COOKIE = 'message-demo-user'

export async function getUsers(): Promise<User[]> {
  'use cache'
  cacheTag('users')
  cacheLife('hours')
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { handle: true, id: true, name: true, role: true },
  })
}

export async function searchUsers(query: string): Promise<User[]> {
  'use cache'
  cacheTag('users')
  cacheLife('hours')
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { handle: true, id: true, name: true, role: true },
    take: 6,
    where: query
      ? {
          OR: [
            { handle: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
  })
}

export async function getCurrentUser(): Promise<User> {
  'use cache: private'
  cacheTag('current-user')
  cacheLife({ stale: 60 })
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value
  const users = await getUsers()
  return users.find((user) => user.id === userId) ?? users[0]
}

export async function verifyAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
