import { Hash } from 'lucide-react'
import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { getChannel } from '@/features/channel/channel-queries'
import { Thread, ThreadSkeleton } from '@/features/message/components/thread'
import { ThreadPanel } from '@/features/message/components/thread-panel'

export default function ThreadPage({
  params,
}: PageProps<'/channel/[channelId]/thread/[messageId]'>) {
  return (
    <div className="h-full" data-thread-panel>
      <ThreadPanel
        subtitle={
          <Suspense fallback={null}>
            {params.then(async ({ channelId }) => {
              const channel = await getChannel(channelId)
              return (
                <span className="text-muted dark:text-muted-dark flex min-w-0 items-center gap-1 text-sm font-normal">
                  <span>in</span>
                  <Hash
                    aria-hidden
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                  />
                  <span className="truncate">{channel.name}</span>
                </span>
              )
            })}
          </Suspense>
        }
      >
        <ErrorBoundary title="Replies didn’t load">
          <Suspense fallback={<ThreadSkeleton />}>
            {params.then(({ channelId, messageId }) => (
              <Crossfade>
                <Thread channelId={channelId} messageId={messageId} />
              </Crossfade>
            ))}
          </Suspense>
        </ErrorBoundary>
      </ThreadPanel>
    </div>
  )
}
