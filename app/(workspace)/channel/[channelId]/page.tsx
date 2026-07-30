import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import {
  ChannelHeader,
  ChannelHeaderSkeleton,
} from '@/features/channel/components/channel-header'
import {
  ChannelDetails,
  ChannelDetailsSkeleton,
} from '@/features/channel/components/channel-details'
import { ChannelDetailPanel } from '@/features/message/components/channel-detail-panel'
import { MarkChannelRead } from '@/features/channel/components/mark-channel-read'
import {
  MessageComposer,
  MessageComposerFallback,
} from '@/features/message/components/message-composer'
import {
  MessageThread,
  MessageThreadSkeleton,
} from '@/features/message/components/message-thread'
import { getChannel } from '@/features/channel/channel-queries'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: PageProps<'/channel/[channelId]'>): Promise<Metadata> {
  const { channelId } = await params
  const channel = await getChannel(channelId)
  const title = `#${channel.name}`
  const url = `/channel/${channelId}`
  return {
    alternates: { canonical: url },
    description: channel.description,
    title,
  }
}

export default function ChannelPage({
  params,
}: PageProps<'/channel/[channelId]'>) {
  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] max-md:h-[calc(100dvh-3.5rem)]">
      <Suspense
        fallback={
          <>
            <ChannelHeaderSkeleton />
            <div className="flex min-h-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
                <MessageThreadSkeleton />
                <MessageComposerFallback />
              </div>
              <div
                aria-hidden
                className="relative hidden shrink-0 lg:block"
                style={{ width: 320 }}
              >
                <ChannelDetailsSkeleton />
              </div>
            </div>
          </>
        }
      >
        {params.then(({ channelId }) => (
          <>
            <MarkChannelRead channelId={channelId} />
            <Crossfade>
              <ChannelHeader channelId={channelId} />
            </Crossfade>
            <div className="flex min-h-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
                <Crossfade>
                  <MessageThread channelId={channelId} />
                </Crossfade>
                <MessageComposer channelId={channelId} />
              </div>
              <ChannelDetailPanel
                details={
                  <Crossfade>
                    <ChannelDetails channelId={channelId} />
                  </Crossfade>
                }
              />
            </div>
          </>
        ))}
      </Suspense>
    </div>
  )
}
