import { Suspense } from 'react'
import {
  Thread,
  ThreadSkeleton,
} from '@/features/message/components/thread'

export default function ThreadPage({
  params,
}: PageProps<'/channel/[channelId]/thread/[messageId]'>) {
  return (
    <div className="h-dvh max-md:h-[calc(100dvh-3.5rem)]">
      <Suspense fallback={<ThreadSkeleton />}>
        {params.then(({ channelId, messageId }) => (
          <Thread channelId={channelId} messageId={messageId} />
        ))}
      </Suspense>
    </div>
  )
}
