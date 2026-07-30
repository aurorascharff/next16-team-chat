import { revalidatePath, revalidateTag } from 'next/cache'
import { verifyAuth } from '@/features/user/user-queries'
import {
  activityTag,
  markActivityRead,
} from '@/features/workspace/workspace-queries'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const user = await verifyAuth()
  const { itemId } = await params
  await markActivityRead(user.id, itemId)
  revalidateTag(activityTag(user.id), 'max')
  revalidatePath('/activity')
  return new Response(null, { status: 204 })
}
