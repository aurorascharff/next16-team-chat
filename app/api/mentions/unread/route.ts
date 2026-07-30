import { getCurrentUser } from '@/features/user/user-queries'
import { getUnreadMentionCount } from '@/features/message/message-queries'

export async function GET() {
  const user = await getCurrentUser()
  return Response.json({ count: await getUnreadMentionCount(user.id) })
}
