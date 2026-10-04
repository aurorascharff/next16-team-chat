import { preload, SWRConfig } from 'swr'
import { cacheLife, cacheTag } from 'next/cache'
import { Skeleton } from '@/components/ui/skeleton'
import { channelTags } from '@/features/channel/channel-cache'
import { getLastReadAt } from '@/features/channel/channel-queries'
import { isSlowMode } from '@/features/demo/slow-mode'
import { messageKeys, messageTags } from '@/features/message/message-cache'
import { getMessagesForUser } from '@/features/message/message-queries'
import { userKeys, userTags } from '@/features/user/user-cache'
import { getCurrentUser, getUsers } from '@/features/user/user-queries'
import { MessageList } from './message-list'

export async function MessageThread({ channelId }: { channelId: string }) {
  const [user, slow] = await Promise.all([getCurrentUser(), isSlowMode()])
  return (
    <CachedMessageThread channelId={channelId} slow={slow} userId={user.id} />
  )
}

async function CachedMessageThread({
  channelId,
  slow,
  userId,
}: {
  channelId: string
  slow: boolean
  userId: string
}) {
  'use cache'
  cacheLife('max')
  cacheTag(
    channelTags.lastRead(channelId, userId),
    messageTags.channel(channelId),
    userTags.all,
  )

  const userData = preload(userKeys.all, getUsers)
  const messageData = preload(messageKeys.channel(channelId), () =>
    getMessagesForUser(channelId, userId, slow),
  )
  const lastReadAt = await getLastReadAt(channelId, userId)

  return (
    <SWRConfig value={{ cacheData: { ...messageData, ...userData } }}>
      <MessageList
        channelId={channelId}
        currentUserId={userId}
        key={channelId}
        lastReadAt={lastReadAt}
      />
    </SWRConfig>
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
