import { getMessages } from '@/features/message/message-queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ channelId: string }> },
) {
  const { channelId } = await params
  return Response.json(await getMessages(channelId))
}
