import { redirect } from 'next/navigation'
import type { Route } from 'next'
import type { ReactNode } from 'react'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getCurrentUser } from '@/features/user/user-queries'

export async function FirstChannelRedirect(): Promise<ReactNode> {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const first = channels[0]
  redirect(first ? `/channel/${first.id}` : ('/channels' as Route))
}
