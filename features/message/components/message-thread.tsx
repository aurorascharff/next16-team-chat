import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/app/get-query-client'
import { getMessages } from '@/features/message/message-queries'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageComposer } from './message-composer'
import { MessageList } from './message-list'

export async function MessageThread({ channelId }: { channelId: string }) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    ...messagesQueryOptions(channelId),
    queryFn: () => getMessages(channelId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="thread">
        <MessageList channelId={channelId} />
        <MessageComposer channelId={channelId} />
      </div>
    </HydrationBoundary>
  )
}

export function MessageThreadSkeleton() {
  return (
    <div className="thread skeleton-thread">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="message-row" key={i}>
          <div className="avatar muted" />
          <div className="message-copy">
            <div className="skeleton-line short" />
            <div className="skeleton-line wide" />
          </div>
        </div>
      ))}
    </div>
  )
}
