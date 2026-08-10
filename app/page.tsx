import type { Route } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { SplashScreen } from '@/components/ui/splash-screen'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getCurrentUser } from '@/features/user/user-queries'

export default function HomePage() {
  return (
    <Suspense fallback={<SplashScreen label="Opening Huddle" />}>
      <HomeRedirect />
    </Suspense>
  )
}

async function HomeRedirect() {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const first = channels[0]
  return redirect(first ? `/channel/${first.id}` : ('/channels' as Route))
}
