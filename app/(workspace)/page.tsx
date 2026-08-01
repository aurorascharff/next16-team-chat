import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Route } from 'next'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getCurrentUser } from '@/features/user/user-queries'

async function FirstChannelRedirect() {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const first = channels[0]
  redirect(first ? `/channel/${first.id}` : ('/channels' as Route))
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <FirstChannelRedirect />
    </Suspense>
  )
}
