import { preload, SWRConfig } from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { messageKeys } from '@/features/message/message-cache'
import {
  getMessagesForUser,
  getReplies,
} from '@/features/message/message-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import { ThreadPanel } from './thread-panel'

export async function Thread({
  channelId,
  messageId,
}: {
  channelId: string
  messageId: string
}) {
  const user = await getCurrentUser()
  const messages = preload(messageKeys.channel(channelId), () =>
    getMessagesForUser(channelId, user.id),
  )
  const replies = preload(messageKeys.replies(messageId), () =>
    getReplies(messageId),
  )

  return (
    <SWRConfig value={{ cacheData: { ...messages, ...replies } }}>
      <ThreadPanel channelId={channelId} messageId={messageId} />
    </SWRConfig>
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
