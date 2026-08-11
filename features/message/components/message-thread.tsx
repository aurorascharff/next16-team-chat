import { HydrationBoundary } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { MarkChannelRead } from '@/features/channel/components/mark-channel-read'
import { channelKeys, channelTags } from '@/features/channel/channel-cache'
import { getLastReadAt } from '@/features/channel/channel-queries'
import { messageKeys, messageTags } from '@/features/message/message-cache'
import { getMessagesForUser } from '@/features/message/message-queries'
import { userKeys, userTags } from '@/features/user/user-cache'
import { getCurrentUser, getUsers } from '@/features/user/user-queries'
import { dehydrate } from '@/lib/react-query-hydration'
import { MessageList } from './message-list'

export async function MessageThread({ channelId }: { channelId: string }) {
  const user = await getCurrentUser()
  const [messages, users, lastReadAt] = await Promise.all([
    getMessagesForUser(channelId, user.id),
    getUsers(),
    getLastReadAt(channelId, user.id),
  ])

  return (
    <HydrationBoundary
      state={await dehydrate(
        [
          { queryKey: channelKeys.lastRead(channelId), data: lastReadAt },
          { queryKey: messageKeys.channel(channelId), data: messages },
          { queryKey: userKeys.all, data: users },
        ],
        {
          tags: [
            channelTags.lastRead(channelId, user.id),
            messageTags.channel(channelId),
            userTags.all,
          ],
        },
      )}
    >
      <MessageList
        channelId={channelId}
        currentUserId={user.id}
        key={channelId}
        lastReadAt={lastReadAt}
      />
      <MarkChannelRead channelId={channelId} />
    </HydrationBoundary>
  )
}

export function MessageThreadSkeleton() {
  return (
    <section
      aria-hidden
      aria-label="Messages"
      className="flex flex-1 flex-col-reverse overflow-y-auto overscroll-contain py-3"
    >
      <div className="flex flex-col opacity-45">
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <div
              className="border-divider/40 dark:border-divider-dark/40 flex min-h-20 gap-3 border-b px-5 py-3"
              key={i}
            >
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3.5 w-full max-w-md rounded" />
              </div>
            </div>
          )
        })}
        <div className="flex min-h-20 gap-3 px-5 py-3">
          <Skeleton className="size-9 shrink-0 rounded-lg" />
        </div>
      </div>
    </section>
  )
}
