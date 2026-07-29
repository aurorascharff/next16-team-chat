import { getCurrentUser } from '@/features/user/user-queries'
import { searchChannels } from '@/features/channel/channel-queries'

export async function GET() {
  const user = await getCurrentUser()
  const channels = await searchChannels(user.id)
  return Response.json(
    channels.map((channel) => {
      return {
        group: channel.group,
        id: channel.id,
        isPrivate: channel.isPrivate,
        name: channel.name,
      }
    }),
  )
}
