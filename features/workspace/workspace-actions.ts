'use server'

import { updateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import { markActivityItemsRead } from './workspace-queries'

export async function markActivityReadAction(itemIds: string[]) {
  const user = await verifyAuth()
  await markActivityItemsRead(user.id, itemIds)
  updateTag(`activity-reads:${user.id}`)
}
