import { getMessages } from '@/features/message/message-queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  const { channelId } = await params
  const cursor = new URL(request.url).searchParams.get('cursor') ?? undefined
  return Response.json(await getMessages(channelId, cursor))
}
