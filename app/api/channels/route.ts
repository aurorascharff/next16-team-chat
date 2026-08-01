import { getChannelSearchResults } from '@/features/channel/channel-queries'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim().toLowerCase()
  const { channels } = await getChannelSearchResults()
  return Response.json(
    query
      ? channels.filter((channel) => {
          return (
            channel.name.toLowerCase().includes(query) ||
            channel.group.toLowerCase().includes(query)
          )
        })
      : channels,
  )
}
