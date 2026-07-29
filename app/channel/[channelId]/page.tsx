import { Suspense } from 'react'
import {
  ChannelHeader,
  ChannelHeaderSkeleton,
} from '@/features/channel/components/channel-header'
import {
  ChannelDetails,
  ChannelDetailsSkeleton,
} from '@/features/channel/components/channel-details'
import {
  MessageThread,
  MessageThreadSkeleton,
} from '@/features/message/components/message-thread'

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>
}) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)]">
      <Suspense fallback={<ChannelHeaderSkeleton />}>
        {params.then(({ channelId }) => {
          return <ChannelHeader channelId={channelId} />
        })}
      </Suspense>
      <div className="grid min-h-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Suspense fallback={<MessageThreadSkeleton />}>
          {params.then(({ channelId }) => {
            return <MessageThread channelId={channelId} />
          })}
        </Suspense>
        <Suspense fallback={<ChannelDetailsSkeleton />}>
          {params.then(({ channelId }) => {
            return <ChannelDetails channelId={channelId} />
          })}
        </Suspense>
      </div>
    </div>
  )
}
