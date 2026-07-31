import { getUnreadActivity } from '@/features/workspace/workspace-queries'

export async function GET() {
  return Response.json(await getUnreadActivity())
}
