import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { getCurrentUser } from '@/features/user/user-queries'
import { listInbox } from './workspace-store'

export async function getInbox() {
  const user = await getCurrentUser()
  return getInboxCached(user.id)
}

async function getInboxCached(userId: string) {
  'use cache'
  cacheTag('messages')
  cacheLife({ stale: 30 })
  return listInbox(userId)
}
