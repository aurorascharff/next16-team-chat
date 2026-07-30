import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cacheLife, cacheTag } from 'next/cache'
import { Skeleton } from '@/components/ui/skeleton'
import { getLastReadAt } from '@/features/channel/channel-queries'
import { isSlowMode } from '@/features/demo/slow-mode'
import {
  getMessagesCached,
  messagesTag,
} from '@/features/message/message-queries'
import { messageKeys } from '@/features/message/hooks/message-query-options'
import { getCurrentUser, getUsers } from '@/features/user/user-queries'
import { userKeys } from '@/features/user/hooks/user-query-options'
import { cn } from '@/lib/utils'
import { MessageList } from './message-list'

async function getMessagesState(
  channelId: string,
  userId: string,
  slow: boolean,
) {
  'use cache'
  cacheTag(messagesTag(channelId))
  cacheLife({ stale: 30 })

  const queryClient = new QueryClient()
  const [messages, users] = await Promise.all([
    getMessagesCached(channelId, userId, slow),
    getUsers(),
  ])

  queryClient.setQueryData(messageKeys.channel(channelId), messages)
  queryClient.setQueryData(userKeys.all, users)

  return dehydrate(queryClient)
}

export async function MessageThread({ channelId }: { channelId: string }) {
  const user = await getCurrentUser()
  const [state, lastReadAt] = await Promise.all([
    getMessagesState(channelId, user.id, await isSlowMode()),
    getLastReadAt(channelId, user.id),
  ])

  return (
    <HydrationBoundary state={state}>
      <MessageList
        channelId={channelId}
        currentUserId={user.id}
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
    <div className="flex flex-1 flex-col justify-end overflow-hidden">
      <div className="flex flex-col gap-1 py-3">
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
  )
}
