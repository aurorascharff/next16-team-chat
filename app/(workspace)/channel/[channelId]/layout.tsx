import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import {
  ChannelHeader,
  ChannelHeaderSkeleton,
} from '@/features/channel/components/channel-header'
import { MessageComposer } from '@/features/message/components/message-composer'
import {
  MessageThread,
  MessageThreadSkeleton,
} from '@/features/message/components/message-thread'

export default function ChannelLayout({
  children,
  params,
}: LayoutProps<'/channel/[channelId]'> & { children: ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)]">
      <Suspense fallback={<ChannelHeaderSkeleton />}>
        {params.then(({ channelId }) => (
          <Crossfade>
            <ChannelHeader channelId={channelId} />
          </Crossfade>
        ))}
      </Suspense>
      <div className="flex min-h-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
          <ErrorBoundary title="Messages unavailable">
            <Suspense fallback={<MessageThreadSkeleton />}>
              <Crossfade>
                {params.then(({ channelId }) => (
                  <MessageThread channelId={channelId} />
                ))}
              </Crossfade>
            </Suspense>
          </ErrorBoundary>
          <MessageComposer />
        </div>
        <ResizablePanel className="channel-route-panel">
          {children}
        </ResizablePanel>
      </div>
    </div>
  )
}
