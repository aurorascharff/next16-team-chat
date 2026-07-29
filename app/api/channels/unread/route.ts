import { getUnreadChannels } from '@/features/channel/channel-queries'

export async function GET() {
  return Response.json(await getUnreadChannels())
}
