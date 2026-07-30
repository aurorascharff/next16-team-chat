import { HydrationBoundary } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { getLastReadAt } from '@/features/channel/channel-queries'
import { getMessagesForUser } from '@/features/message/message-queries'
import { messageKeys } from '@/features/message/message-query-options'
import { getCurrentUser, getUsers } from '@/features/user/user-queries'
import { userKeys } from '@/features/user/user-query-options'
import { dehydrate } from '@/lib/react-query-hydration'
import { cn } from '@/lib/utils'
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
      state={await dehydrate([
        { queryKey: messageKeys.channel(channelId), data: messages },
        { queryKey: userKeys.all, data: users },
      ])}
    >
      <MessageList
        channelId={channelId}
        currentUserId={user.id}
        key={channelId}
        lastReadAt={lastReadAt}
      />
    </HydrationBoundary>
  )
}

export function MessageThreadSkeleton() {
  const rows = [
    { body: 'w-3/4', name: 'w-24' },
    { body: 'w-1/2', name: 'w-20' },
    { body: 'w-5/6', name: 'w-28' },
    { body: 'w-2/5', name: 'w-16' },
    { body: 'w-2/3', name: 'w-24' },
  ]

  return (
    <section
      aria-hidden
      aria-label="Messages"
      className="relative flex min-h-0 flex-1"
    >
      <div className="flex-1 overflow-y-auto py-3">
        <div className="flex min-h-full flex-col justify-end">
          <div className="flex flex-col gap-1">
            {rows.map((row, i) => {
              return (
                <div className="flex gap-3 px-5 py-2.5" key={i}>
                  <Skeleton className="size-9 shrink-0 rounded-lg" />
                  <div className="flex flex-1 flex-col gap-2 pt-1">
                    <Skeleton className={cn('h-3 rounded-full', row.name)} />
                    <Skeleton
                      className={cn('h-3.5 max-w-lg rounded-full', row.body)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
