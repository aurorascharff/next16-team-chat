import { getReplies } from '@/features/message/message-queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params
  return Response.json(await getReplies(messageId))
}
