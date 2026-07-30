'use server'

import { revalidateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import { markActivityItemsRead } from './workspace-queries'

export async function markActivityReadAction(itemIds: string[]) {
  const user = await verifyAuth()
  await markActivityItemsRead(user.id, itemIds)
  revalidateTag(`activity-reads:${user.id}`, { expire: 0 })
}
