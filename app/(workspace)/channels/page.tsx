import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
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
    <div className="flex min-h-0 flex-col gap-4 p-3 md:hidden">
      <WorkspaceNav />
      <Suspense fallback={<ChannelListSkeleton />}>
        <Crossfade>
          <ChannelList />
        </Crossfade>
      </Suspense>
    </div>
  )
}
