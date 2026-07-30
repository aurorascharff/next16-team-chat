'use server'

import { updateTag } from 'next/cache'
import { markMentionsRead } from '@/features/message/message-mention-queries'
import { verifyAuth } from '@/features/user/user-queries'

export async function markMentionsReadAction() {
  const user = await verifyAuth()
  await markMentionsRead(user.id)
  updateTag('mentions')
}
