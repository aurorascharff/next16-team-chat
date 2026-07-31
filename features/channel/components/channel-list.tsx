import { Skeleton } from '@/components/ui/skeleton'
import {
  getCurrentChannelLayout,
  getUnreadChannels,
} from '@/features/channel/channel-queries'
import { ChannelNav } from './channel-nav'

export async function ChannelList() {
  const [{ groups, userId }, unread] = await Promise.all([
    getCurrentChannelLayout(),
    getUnreadChannels(),
  ])
  const groupsWithUnread = groups.map((group) => {
    return {
      ...group,
      channels: group.channels.map((channel) => {
        return { ...channel, unread: unread[channel.id] }
      }),
    }
  })
  return <ChannelNav groups={groupsWithUnread} key={userId} />
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
