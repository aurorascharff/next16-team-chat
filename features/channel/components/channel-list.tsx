import { HydrationBoundary } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { channelKeys, channelTags } from '@/features/channel/channel-cache'
import {
  getChannelLayoutForUser,
  getUnreadChannelsForUser,
} from '@/features/channel/channel-queries'
import { isSlowMode } from '@/features/demo/slow-mode'
import { getCurrentUser } from '@/features/user/user-queries'
import { dehydrate } from '@/lib/dehydrate'
import { ChannelNav } from './channel-nav'

export async function ChannelList() {
  const [user, slow] = await Promise.all([getCurrentUser(), isSlowMode()])

  const [groups, unread] = await Promise.all([
    getChannelLayoutForUser(user.id, slow),
    getUnreadChannelsForUser(user.id),
  ])

  const groupsWithUnread = groups.map((group) => {
    return {
      ...group,
      channels: group.channels.map((channel) => {
        return { ...channel, unread: unread[channel.id] }
      }),
    }
  })
  const state = await dehydrate(
    [{ queryKey: channelKeys.unread, data: unread }],
    { tags: [channelTags.unread] },
  )

  return (
    <HydrationBoundary state={state}>
      <ChannelNav groups={groupsWithUnread} key={user.id} />
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
