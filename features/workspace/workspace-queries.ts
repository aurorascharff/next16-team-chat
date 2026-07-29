import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { listInbox, listThreads } from './workspace-store'

export async function getInbox() {
  'use cache'
  cacheTag('messages')
  cacheLife({ stale: 30 })
  return listInbox()
}

export async function getThreads() {
  'use cache'
  cacheTag('messages')
  cacheLife({ stale: 30 })
  return listThreads()
}
