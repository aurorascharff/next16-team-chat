import { AnimatedSuspense } from '@/components/ui/animated-suspense'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import {
  ChannelList,
  ChannelListSkeleton,
} from '@/features/channel/components/channel-list'
import { WorkspaceNav } from '@/features/workspace/components/workspace-nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/channels' },
  description: 'Browse the workspace channels.',
  title: 'Channels',
}

export default function ChannelsPage() {
  return (
    <>
      <div className="flex min-h-0 flex-col gap-4 p-3 md:hidden">
        <WorkspaceNav />
        <ErrorBoundary compact title="Channels unavailable">
          <AnimatedSuspense fallback={<ChannelListSkeleton />}>
            <ChannelList />
          </AnimatedSuspense>
        </ErrorBoundary>
      </div>
      <div className="hidden h-full items-center justify-center md:flex">
        <EmptyState
          body="Choose a channel from the sidebar to view its messages."
          title="Select a channel"
        />
      </div>
    </>
  )
}
