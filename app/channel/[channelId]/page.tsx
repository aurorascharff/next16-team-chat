import { Suspense } from 'react'
import {
  ChannelHeader,
  ChannelHeaderSkeleton,
} from '@/features/channel/components/channel-header'
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
    <div className="channel-page">
      <Suspense fallback={<ChannelHeaderSkeleton />}>
        {params.then(({ channelId }) => (
          <ChannelHeader channelId={channelId} />
        ))}
      </Suspense>
      <Suspense fallback={<MessageThreadSkeleton />}>
        {params.then(({ channelId }) => (
          <MessageThread channelId={channelId} />
        ))}
      </Suspense>
    </div>
  )
}
