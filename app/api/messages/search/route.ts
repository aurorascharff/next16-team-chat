import { getWorkspaceSearchMessages } from '@/features/message/message-queries'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim().toLowerCase()
  if (!query) return Response.json([])

  const messages = await getWorkspaceSearchMessages()
  return Response.json(
    messages
      .filter((message) => message.body.toLowerCase().includes(query))
      .slice(0, 8),
  )
}
