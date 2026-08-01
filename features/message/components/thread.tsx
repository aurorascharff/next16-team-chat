import { HydrationBoundary } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { messageKeys, messageTags } from '@/features/message/message-cache'
import {
  getMessagesForUser,
  getReplies,
} from '@/features/message/message-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import { dehydrate } from '@/lib/react-query-hydration'
import { ThreadPanel } from './thread-panel'

export async function Thread({
  channelId,
  messageId,
}: {
  channelId: string
  messageId: string
}) {
  const user = await getCurrentUser()
  const [messages, replies] = await Promise.all([
    getMessagesForUser(channelId, user.id),
    getReplies(messageId),
  ])

  return (
    <HydrationBoundary
      state={await dehydrate(
        [
          { queryKey: messageKeys.channel(channelId), data: messages },
          { queryKey: messageKeys.replies(messageId), data: replies },
        ],
        {
          tags: [
            messageTags.channel(channelId),
            messageTags.replies(messageId),
          ],
        },
      )}
    >
      <ThreadPanel channelId={channelId} messageId={messageId} />
    </HydrationBoundary>
  )
}

export function ThreadSkeleton() {
  return (
    <aside
      aria-label="Loading thread"
      className="border-divider dark:border-divider-dark flex h-full min-h-0 flex-col border-l"
    >
      <header className="border-divider dark:border-divider-dark flex min-h-16 items-center border-b px-4 py-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </header>
      <div className="flex-1 overflow-hidden py-2">
        <div className="flex flex-col opacity-45">
          <div className="border-divider/40 dark:border-divider-dark/40 flex min-h-20 gap-3 border-b px-5 py-3">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3.5 w-full max-w-sm rounded" />
            </div>
          </div>
          <div className="mx-5 my-3">
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      </div>
    </aside>
  )
}
