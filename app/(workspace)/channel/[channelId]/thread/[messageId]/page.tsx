import { Suspense } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { Thread, ThreadSkeleton } from '@/features/message/components/thread'

export default function ThreadPage({
  params,
}: PageProps<'/channel/[channelId]/thread/[messageId]'>) {
  return (
    <ResizablePanel
      className="max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:bottom-14 max-lg:z-30 max-lg:bg-white dark:max-lg:bg-black"
      mobile
    >
      <Suspense fallback={<ThreadSkeleton />}>
        {params.then(({ channelId, messageId }) => (
          <Thread channelId={channelId} messageId={messageId} />
        ))}
      </Suspense>
    </ResizablePanel>
  )
}
