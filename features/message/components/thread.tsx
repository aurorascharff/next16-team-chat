import { preload, SWRConfig } from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { messageKeys } from '@/features/message/message-cache'
import {
  getMessagesForUser,
  getReplies,
} from '@/features/message/message-queries'
import { getCurrentUser } from '@/features/user/user-queries'
import { ThreadBody } from './thread-panel'

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
      <ThreadBody channelId={channelId} messageId={messageId} />
    </SWRConfig>
  )
}

export function ThreadSkeleton() {
  return (
    <div aria-label="Loading thread" className="flex flex-col opacity-45">
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
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <div className="flex min-h-16 gap-3 px-5 py-3" key={i}>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            {i === 0 ? (
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3.5 w-2/3 rounded" />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
