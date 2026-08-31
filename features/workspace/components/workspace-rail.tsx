import type { Route } from 'next'
import { AnimatedSuspense } from '@/components/ui/animated-suspense'
import { listChannelsForUser } from '@/features/channel/channel-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import {
  WorkspaceRailLink,
  WorkspaceRailLinkShell,
  WorkspaceRailLinkSkeleton,
} from './workspace-rail-link'

type PrimaryNavItem = {
  href: Route
  icon: 'activity' | 'home'
  label: string
  match: string[]
  showActivityDot?: boolean
}

const ACTIVITY_ITEM: PrimaryNavItem = {
  href: '/activity',
  icon: 'activity',
  label: 'Activity',
  match: ['/activity'],
  showActivityDot: true,
}

export function WorkspaceRail() {
  return (
    <nav
      aria-label="Primary"
      className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-full w-18 shrink-0 flex-col items-center gap-1 border-r pt-3"
    >
      <AnimatedSuspense
        fallback={<WorkspaceRailLinkSkeleton item={homeItem('/')} />}
      >
        <HomeRailLink />
      </AnimatedSuspense>
      <AnimatedSuspense
        fallback={<WorkspaceRailLinkShell item={ACTIVITY_ITEM} />}
      >
        <WorkspaceRailLink item={ACTIVITY_ITEM} />
      </AnimatedSuspense>
    </nav>
  )
}

async function HomeRailLink() {
  const user = await getCurrentUser()
  const channels = await listChannelsForUser(user.id)
  const homeHref = channels[0]
    ? (`/channel/${channels[0].id}` as Route)
    : ('/channels' as Route)

  return <WorkspaceRailLink item={homeItem(homeHref)} />
}

function homeItem(href: Route): PrimaryNavItem {
  return {
    href,
    icon: 'home',
    label: 'Home',
    match: ['/', '/channel', '/channels'],
  }
}
