import { getChannelSearchResults } from '@/features/channel/channel-queries'

export async function GET() {
  const { channels } = await getChannelSearchResults()
  return Response.json(channels)
}
