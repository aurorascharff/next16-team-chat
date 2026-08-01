import { getWorkspaceSearchMessages } from '@/features/message/message-queries'

export async function GET() {
  return Response.json(await getWorkspaceSearchMessages())
}
