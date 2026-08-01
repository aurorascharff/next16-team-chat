import { redirect } from 'next/navigation'
import type { Route } from 'next'
import type { ReactNode } from 'react'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import { DesktopChannelRedirect } from './desktop-channel-redirect'

export async function FirstChannelRedirect(): Promise<ReactNode> {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const first = channels[0]
  redirect(first ? `/channel/${first.id}` : ('/channels' as Route))
}

export async function DesktopFirstChannelRedirect() {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const first = channels[0]

  if (!first) {
    return null
  }

  return <DesktopChannelRedirect href={`/channel/${first.id}` as Route} />
}
