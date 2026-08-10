import type { Route } from 'next'
import { redirect } from 'next/navigation'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getCurrentUser } from '@/features/user/user-queries'

export const instant = false

export default async function HomePage() {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const first = channels[0]
  redirect(first ? `/channel/${first.id}` : ('/channels' as Route))
}
