import { getCurrentUser } from '@/features/user/user-queries'
import { getUnreadActivityCount } from '@/features/workspace/workspace-queries'

export async function GET() {
  const user = await getCurrentUser()
  return Response.json({ count: await getUnreadActivityCount(user.id) })
}
