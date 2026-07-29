import { getCurrentUser } from '@/features/user/user-queries'
import { listChannels } from '@/features/message/message-store'

export async function GET() {
  const user = await getCurrentUser()
  const channels = await listChannels(user.id)
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
