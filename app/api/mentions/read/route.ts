import { revalidateTag } from 'next/cache'
import {
  markMentionsRead,
  mentionsTag,
} from '@/features/message/message-queries'
import { verifyAuth } from '@/features/user/user-queries'

export async function POST() {
  const user = await verifyAuth()
  await markMentionsRead(user.id)
  revalidateTag('mentions', 'max')
  revalidateTag(mentionsTag(user.id), 'max')
  return new Response(null, { status: 204 })
}
