import { Suspense, type ReactNode } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { ErrorBoundary } from '@/components/ui/error-boundary'
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
import { WorkspaceNav } from '@/features/workspace/components/workspace-nav'
import { WorkspaceRail } from '@/features/workspace/components/workspace-rail'

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] flex-col overflow-hidden pt-[env(safe-area-inset-top)] md:h-dvh md:flex-row">
      <div className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col md:flex">
        <div className="flex min-h-0 flex-1">
          <WorkspaceRail />
          <Suspense
            fallback={
              <div className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark h-full w-64 shrink-0 border-r" />
            }
          >
            <ChannelSidebar>
              <WorkspaceNav />
              <SearchButton />
              <div className="relative -mx-1 min-h-0 flex-1 overflow-hidden">
                <div className="h-full [scrollbar-gutter:stable] overflow-y-auto overscroll-contain px-1 pt-3 pb-3">
                  <ErrorBoundary compact title="Channels unavailable">
                    <Suspense fallback={<ChannelListSkeleton />}>
                      <Crossfade>
                        <ChannelList />
                      </Crossfade>
                    </Suspense>
                  </ErrorBoundary>
                </div>
                <div
                  aria-hidden
                  className="from-surface dark:from-surface-dark pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b to-transparent"
                />
                <div
                  aria-hidden
                  className="from-surface dark:from-surface-dark pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent"
                />
              </div>
            </ChannelSidebar>
          </Suspense>
        </div>
        <Suspense fallback={<CurrentUserCardSkeleton />}>
          <Crossfade>
            <CurrentUserCard />
          </Crossfade>
        </Suspense>
      </div>
      <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
