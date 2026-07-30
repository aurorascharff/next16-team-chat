import { Suspense, type ReactNode } from 'react'
import {
  ChannelList,
  ChannelListSkeleton,
} from '@/features/channel/components/channel-list'
import {
  CurrentUserCard,
  CurrentUserCardSkeleton,
} from '@/features/user/components/current-user-card'
import { ChannelSidebar } from '@/features/workspace/components/channel-sidebar'
import { SearchButton } from '@/features/workspace/components/search-button'
import {
  WorkspaceNav,
  WorkspaceNavSkeleton,
} from '@/features/workspace/components/workspace-nav'
import { WorkspaceRail } from '@/features/workspace/components/workspace-rail'

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-dvh md:flex-row">
      <div className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col md:flex">
        <div className="flex min-h-0 flex-1">
          <WorkspaceRail />
          <Suspense
            fallback={
              <div className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark h-full w-64 shrink-0 border-r" />
            }
          >
            <ChannelSidebar>
              <Suspense fallback={<WorkspaceNavSkeleton />}>
                <WorkspaceNav />
              </Suspense>
              <SearchButton />
              <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
                <Suspense fallback={<ChannelListSkeleton />}>
                  <ChannelList />
                </Suspense>
              </div>
            </ChannelSidebar>
          </Suspense>
        </div>
        <Suspense fallback={<CurrentUserCardSkeleton />}>
          <CurrentUserCard />
        </Suspense>
      </div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
