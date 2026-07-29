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
import { ChannelSidebar } from '@/features/message/components/channel-sidebar'
import { MarkChannelRead } from '@/features/channel/components/mark-channel-read'
import {
  MessageComposer,
  MessageComposerFallback,
} from '@/features/message/components/message-composer'
import {
  MessageThread,
  MessageThreadSkeleton,
} from '@/features/message/components/message-thread'
import { ThreadProvider } from '@/features/message/components/thread-context'
import { ThreadDeepLink } from '@/features/message/components/thread-deep-link'
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
    <ThreadProvider>
      <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] max-md:h-[calc(100dvh-3.5rem)]">
        <Suspense fallback={null}>
          {params.then(({ channelId }) => {
            return (
              <>
                <MarkChannelRead channelId={channelId} />
                <ThreadDeepLink channelId={channelId} />
              </>
            )
          })}
        </Suspense>
        <Suspense fallback={<ChannelHeaderSkeleton />}>
          <Crossfade>
            {params.then(({ channelId }) => {
              return <ChannelHeader channelId={channelId} />
            })}
          </Crossfade>
        </Suspense>
        <div className="flex min-h-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
            <Suspense fallback={<MessageThreadSkeleton />}>
              <Crossfade>
                {params.then(({ channelId }) => {
                  return <MessageThread channelId={channelId} />
                })}
              </Crossfade>
            </Suspense>
            <Suspense fallback={<MessageComposerFallback />}>
              {params.then(({ channelId }) => {
                return <MessageComposer channelId={channelId} />
              })}
            </Suspense>
          </div>
          <ChannelSidebar
            details={
              <Suspense fallback={<ChannelDetailsSkeleton />}>
                <Crossfade>
                  {params.then(({ channelId }) => {
                    return <ChannelDetails channelId={channelId} />
                  })}
                </Crossfade>
              </Suspense>
            }
          />
        </div>
      </div>
    </ThreadProvider>
  )
}
