import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cacheLife, cacheTag } from 'next/cache'
import { Skeleton } from '@/components/ui/skeleton'
import { channelKeys, channelTags } from '@/features/channel/channel-cache'
import {
  getChannelLayoutForUser,
  getUnreadChannelsForUser,
} from '@/features/channel/channel-queries'
import { isSlowMode } from '@/features/demo/slow-mode'
import { getCurrentUser } from '@/features/user/user-queries'
import { ChannelNav } from './channel-nav'

export async function ChannelList() {
  const [user, slow] = await Promise.all([getCurrentUser(), isSlowMode()])
  return <CachedChannelList slow={slow} userId={user.id} />
}

async function CachedChannelList({
  slow,
  userId,
}: {
  slow: boolean
  userId: string
}) {
  'use cache'
  cacheLife('hours')
  cacheTag(channelTags.all, channelTags.user(userId), channelTags.unread)

  const [groups, unread] = await Promise.all([
    getChannelLayoutForUser(userId, slow),
    getUnreadChannelsForUser(userId),
  ])

  const groupsWithUnread = groups.map((group) => {
    return {
      ...group,
      channels: group.channels.map((channel) => {
        return { ...channel, unread: unread[channel.id] }
      }),
    }
  })
  const queryClient = new QueryClient()
  queryClient.setQueryData(channelKeys.unread, unread)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelNav groups={groupsWithUnread} key={userId} />
    </HydrationBoundary>
  )
}

export function ChannelListSkeleton() {
  return (
    <div
      aria-label="Loading channels"
      className="flex flex-col gap-0.5 opacity-45"
    >
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <div className="flex min-h-8 items-center gap-2 px-2.5" key={i}>
            <Skeleton className="size-4 shrink-0 rounded" />
            {i < 3 ? <Skeleton className="h-3 w-24 rounded" /> : null}
          </div>
        )
      })}
    </div>
  )
}
