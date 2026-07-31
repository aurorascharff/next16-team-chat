'use server'

import { updateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import { activityTags } from './workspace-cache'
import { markActivityItemsRead } from './workspace-queries'

export async function markActivityReadAction(itemIds: string[]) {
  const user = await verifyAuth()
  const changed = await markActivityItemsRead(user.id, itemIds)
  if (changed) {
    updateTag(activityTags.reads(user.id))
  }
}
