import type { ReactNode } from 'react'
import { AnimatedSuspense } from '@/components/ui/animated-suspense'
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
      <AnimatedSuspense fallback={<ChannelHeaderSkeleton />}>
        {params.then(({ channelId }) => (
          <ChannelHeader channelId={channelId} />
        ))}
      </AnimatedSuspense>
      <div className="flex min-h-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
          <ErrorBoundary title="Messages unavailable">
            <AnimatedSuspense fallback={<MessageThreadSkeleton />}>
              {params.then(({ channelId }) => (
                <MessageThread channelId={channelId} />
              ))}
            </AnimatedSuspense>
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
